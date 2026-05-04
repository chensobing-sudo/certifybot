// API: Parse uploaded PDF/spec sheet using LLM
// OCR layer: pdf-parse (text extraction from PDF)
// LLM layer: DeepSeek for structured extraction

import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ── 1. Extract text from PDF ──
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text.slice(0, 8000); // first 8000 chars

    // ── 2. Use DeepSeek to extract product info ──
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are a product specification analyzer for bathroom/kitchen plumbing products.
Extract structured product information from the following text (which came from a product spec sheet or PDF).
If a field cannot be determined, return null.

Return ONLY valid JSON (no markdown, no explanation):
{
  "companyName": "..." | null,
  "brandName": "..." | null,
  "productType": "..." | null,
  "modelNumber": "..." | null,
  "material": "..." | null,
  "connectionSize": "..." | null,
  "waterPressure": "..." | null,
  "certifications": ["NSF/ANSI 61", "cUPC", ...] | [],
  "confidence": 0.0-1.0
}

SPEC SHEET TEXT:
${rawText}
`;

    const llmRes = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${deepseekKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 800,
      }),
    });

    if (!llmRes.ok) {
      const err = await llmRes.text();
      return NextResponse.json(
        { error: `DeepSeek error: ${llmRes.status}`, detail: err },
        { status: 502 }
      );
    }

    const llmJson = await llmRes.json();
    const content = llmJson.choices?.[0]?.message?.content ?? "{}";

    let parsed: any;
    try {
      const cleaned = content.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse LLM response", raw: content },
        { status: 502 }
      );
    }

    return NextResponse.json({
      rawText: rawText.slice(0, 500),
      product: parsed,
      rawTextFull: rawText,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
