declare module "pdf-parse" {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: unknown;
    text: string;
    version: string;
  }
  interface PDFParseOptions {
    pagerender?: (pageData: any) => string;
    max?: number;
    version?: string;
  }
  function pdf(dataBuffer: Buffer, options?: PDFParseOptions): Promise<PDFData>;
  export = pdf;
}
