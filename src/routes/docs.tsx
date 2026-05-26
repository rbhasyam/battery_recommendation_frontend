import { createFileRoute, Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "API Docs — Amaron Battery Recommender" },
      { name: "description", content: "Endpoints, request/response schema, and examples for the Amaron battery recommendation API." },
    ],
  }),
  component: Docs,
});

const exampleRequest = `curl -X POST 'http://localhost:8000/recommend' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "query": "I need a battery around 238mm long, 129mm wide with at least 400 CCA"
}'`;

const exampleResponse = `{
  "query": "I need a battery around 238mm long, 129mm wide with at least 400 CCA",
  "recommendations": [
    {
      "rank": 1,
      "series": "PRO",
      "battery_model": "65B24 R/RS/L/LS",
      "bci_group": "51/51R",
      "ref_ah": 50,
      "cca_0f": 420,
      "ca_32f": 500,
      "rc_mins": 80,
      "length_mm": 238,
      "width_mm": 129,
      "height_mm": 227,
      "length_in": 9.37,
      "width_in": 5.08,
      "height_in": 8.94,
      "terminal": "T1/T2",
      "why": "Perfectly matches the dimensions and exceeds the CCA requirement."
    }
  ],
  "summary": "The recommended batteries all fit the specified dimensions..."
}`;

function Row({ field, type, required, desc }: { field: string; type: string; required: string; desc: string }) {
  return (
    <tr className="border-t">
      <td className="px-3 py-2 font-mono text-xs text-foreground">{field}</td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{type}</td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{required}</td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{desc}</td>
    </tr>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  const colors: Record<string, string> = {
    GET: "bg-[oklch(0.95_0.05_240)] text-[oklch(0.4_0.15_240)]",
    POST: "bg-[oklch(0.95_0.05_145)] text-[oklch(0.4_0.15_145)]",
  };
  return (
    <div className="flex items-start gap-3 rounded-md border bg-card p-3">
      <span className={`inline-flex h-6 items-center rounded px-2 text-xs font-bold ${colors[method] ?? "bg-muted"}`}>
        {method}
      </span>
      <div>
        <div className="font-mono text-sm text-foreground">{path}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-sm font-semibold text-foreground hover:text-primary">
            ← Back to recommender
          </Link>
          <span className="text-xs text-muted-foreground">API Documentation</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Battery Recommender API</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A FastAPI service that takes a natural-language battery requirement and returns the top 3 Amaron matches.
          </p>
        </div>

        <Section title="Endpoints">
          <div className="space-y-2">
            <Endpoint method="POST" path="/recommend" desc="Main recommendation endpoint — returns top 3 batteries." />
            <Endpoint method="GET" path="/health" desc="Service status check." />
            <Endpoint method="GET" path="/" desc="API info and example queries." />
          </div>
        </Section>

        <Section title="Request schema">
          <div className="overflow-hidden rounded-md border bg-card">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Field</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Type</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Required</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                <Row field="query" type="string" required="yes*" desc="Natural language or structured requirement string." />
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            * At least one structured field or free-text query must be present.
          </p>
        </Section>

        <Section title="How the query is built">
          <p className="text-sm text-muted-foreground">
            The UI assembles all filled structured fields (dimensions, CCA, CA, capacity, terminal, etc.) plus any free-text
            query into a single combined query string and sends it to <span className="font-mono">POST /recommend</span>.
            You can preview the exact cURL on the home page as you type.
          </p>
        </Section>

        <Section title="Example request">
          <CodeBlock code={exampleRequest} />
        </Section>

        <Section title="Example response">
          <CodeBlock code={exampleResponse} />
        </Section>

        <Section title="Response schema">
          <div className="overflow-hidden rounded-md border bg-card">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Field</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Type</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground" colSpan={2}>Description</th>
                </tr>
              </thead>
              <tbody>
                <Row field="query" type="string" required="—" desc="The query that was sent." />
                <Row field="recommendations" type="array[3]" required="—" desc="Top 3 matching batteries." />
                <Row field="recommendations[].rank" type="int" required="—" desc="1, 2, or 3." />
                <Row field="recommendations[].series" type="string" required="—" desc="PRO / FLO / GO / Jade / Pearl / HI-WAY / 2W AGM." />
                <Row field="recommendations[].battery_model" type="string" required="—" desc="Model identifier." />
                <Row field="recommendations[].bci_group" type="string" required="—" desc="BCI group number." />
                <Row field="recommendations[].ref_ah" type="float" required="—" desc="Capacity in Ah." />
                <Row field="recommendations[].cca_0f" type="float" required="—" desc="Cold cranking amps at 0°F." />
                <Row field="recommendations[].ca_32f" type="float" required="—" desc="Cranking amps at 32°F." />
                <Row field="recommendations[].rc_mins" type="float" required="—" desc="Reserve capacity in minutes." />
                <Row field="length_mm / width_mm / height_mm" type="float" required="—" desc="Dimensions in mm." />
                <Row field="length_in / width_in / height_in" type="float" required="—" desc="Dimensions in inches." />
                <Row field="recommendations[].terminal" type="string" required="—" desc="Terminal type." />
                <Row field="recommendations[].why" type="string" required="—" desc="One-sentence reasoning." />
                <Row field="summary" type="string" required="—" desc="Overall recommendation summary." />
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Error responses">
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li><span className="font-mono">400</span> — Empty query.</li>
            <li><span className="font-mono">502</span> — OpenAI failure or bad JSON returned from the model.</li>
            <li><span className="font-mono">500</span> — CSV load failure on the server.</li>
          </ul>
        </Section>
      </main>
    </div>
  );
}
