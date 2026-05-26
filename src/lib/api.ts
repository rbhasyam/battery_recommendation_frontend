export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000";

export interface Recommendation {
  rank: number;
  match_percentage: number;   // added
  series: string;
  battery_model: string;
  bci_group: string;
  ref_ah: number;
  cca_0f: number;
  ca_32f: number;
  rc_mins: number;
  length_mm: number;
  width_mm: number;
  height_mm: number;
  length_in: number;
  width_in: number;
  height_in: number;
  terminal: string;
  why: string;
}

export interface RecommendResponse {
  query: string;
  recommendations: Recommendation[];
  summary: string;
}

export interface StructuredFields {
  length_mm?: string;
  width_mm?: string;
  height_mm?: string;
  cca?: string;
  ca?: string;
  ref_ah?: string;
  rc_mins?: string;
  terminal?: string;
  series?: string;
  bci_group?: string;
  query?: string;
}

export function buildQueryString(f: StructuredFields): string {
  const parts: string[] = [];

  if (f.length_mm) parts.push(`length ${f.length_mm}mm`);
  if (f.width_mm) parts.push(`width ${f.width_mm}mm`);
  if (f.height_mm) parts.push(`height ${f.height_mm}mm`);
  if (f.cca) parts.push(`at least ${f.cca} CCA`);
  if (f.ca) parts.push(`${f.ca} CA`);
  if (f.ref_ah) parts.push(`${f.ref_ah} Ah capacity`);
  if (f.rc_mins) parts.push(`${f.rc_mins} minutes reserve capacity`);
  if (f.terminal && f.terminal !== "Any") parts.push(`${f.terminal} terminal`);
  if (f.series && f.series !== "Any") parts.push(`${f.series} series`);
  if (f.bci_group) parts.push(`BCI group ${f.bci_group}`);

  const structured = parts.length ? `I need a battery ${parts.join(", ")}` : "";
  const free = f.query?.trim() ?? "";

  if (structured && free) return `${structured}. ${free}`;
  return structured || free;
}

export function buildCurl(baseUrl: string, query: string): string {
  const safeQuery = query.replace(/"/g, '\\"');

  return `curl -X POST '${baseUrl}/recommend' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "query": "${safeQuery}"
}'`;
}

export async function fetchRecommendation(
  baseUrl: string,
  query: string,
): Promise<RecommendResponse> {
  const res = await fetch(`${baseUrl}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function checkHealth(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/health`);
    return res.ok;
  } catch {
    return false;
  }
}