// IAPMO PLD API client — validated working

const API_BASE = "https://pld-api.iapmo.org/api/search/myplc";
const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "User-Agent": "CertifyBot/1.0",
};

export async function searchIAPMO(
  query: string,
  category: "listee" | "standard" | "productDescription" = "listee",
  page = 1,
  perPage = 50
) {
  const resp = await fetch(API_BASE, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      searchCategory: category,
      query,
      searchType: "any",
      sortBy: "file",
      sortDir: "asc",
      currentPage: page,
      itemsPerPage: perPage,
    }),
  });

  if (!resp.ok) throw new Error(`IAPMO API error: ${resp.status}`);
  return resp.json();
}

/** Find companies matching the given name. Returns up to `limit` results. */
export async function findCompanyCerts(
  companyName: string,
  limit = 10
): Promise<any[]> {
  const data = await searchIAPMO(companyName, "listee", 1, limit);
  return (data.results ?? []).filter(
    (r: any) =>
      r.clientName &&
      r.clientName.toLowerCase().includes(companyName.toLowerCase())
  );
}

/** Find cert records by product description keyword. */
export async function findProductsByKeyword(
  keyword: string,
  limit = 20
): Promise<any[]> {
  const data = await searchIAPMO(keyword, "productDescription", 1, limit);
  return data.results ?? [];
}

/** Count how many companies in the US cert DB match a product type keyword. */
export async function countProductType(
  productType: string
): Promise<{ total: number; sample: any[] }> {
  const data = await searchIAPMO(productType, "productDescription", 1, 5);
  return { total: data.totalRecords ?? 0, sample: data.results ?? [] };
}
