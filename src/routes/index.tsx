import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  API_BASE_URL,
  buildQueryString,
  checkHealth,
  fetchRecommendation,
  type RecommendResponse,
  type StructuredFields,
} from "@/lib/api";

import { RecommendationCard } from "@/components/RecommendationCard";

import logo from "@/assets/ar_logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amaron Battery Recommender" },
      {
        name: "description",
        content:
          "Find the right Amaron battery by dimensions, CCA, capacity, and more — powered by an AI recommendation API.",
      },
    ],
  }),
  component: Home,
});

const TERMINALS = [
  "Any",
  "T1",
  "T2",
  "T1/T2",
  "Square",
  "M8",
  "T2/M8",
];

const SERIES = [
  "Any",
  "PRO",
  "FLO",
  "GO",
  "Jade",
  "Pearl",
  "HI-WAY",
  "2W AGM",
];

const EMPTY: StructuredFields = {
  length_mm: "",
  width_mm: "",
  height_mm: "",
  cca: "",
  ca: "",
  ref_ah: "",
  rc_mins: "",
  terminal: "Any",
  series: "Any",
  bci_group: "",
  query: "",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

function Home() {
  const [fields, setFields] = useState<StructuredFields>(EMPTY);

  const [baseUrl] = useState(API_BASE_URL);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [result, setResult] =
    useState<RecommendResponse | null>(null);

  const [health, setHealth] = useState<
    "unknown" | "up" | "down"
  >("unknown");

  useEffect(() => {
    let active = true;

    checkHealth(baseUrl).then((ok) => {
      if (active) {
        setHealth(ok ? "up" : "down");
      }
    });

    return () => {
      active = false;
    };
  }, [baseUrl]);

  const query = useMemo(
    () => buildQueryString(fields),
    [fields]
  );

  const canSubmit =
    query.trim().length > 0 && !loading;

  const update =
    (k: keyof StructuredFields) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
      >
    ) =>
      setFields((prev) => ({
        ...prev,
        [k]: e.target.value,
      }));

  const onSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!canSubmit) {
      setError(
        "Fill at least one field or describe your requirement."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchRecommendation(
        baseUrl,
        query
      );

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setFields(EMPTY);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fc] via-white to-[#eef2ff]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-5">

            <div className="flex h-24 w-44 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
              <img
                src={logo}
                alt="Amaron Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                AI-Assisted Intelligent Battery Fitment & Recommendation Platform
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                AI-powered battery intelligence platform
              </p>
            </div>
          </div>

          <div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
                health === "up"
                  ? "bg-emerald-50 text-emerald-700"
                  : health === "down"
                  ? "bg-red-50 text-red-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  health === "up"
                    ? "bg-emerald-500"
                    : health === "down"
                    ? "bg-red-500"
                    : "bg-slate-400"
                }`}
              />
              API {health}
            </span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5" />

        <div className="mx-auto max-w-[1400px] px-6 py-10">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-700">
              AI Recommendation Engine
            </div>

            <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
              Find the Perfect Battery
              <span className="block bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                in Seconds
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Smart battery recommendation platform powered by
              AI matching, dimensional analysis, and automotive
              intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-[1400px] px-6 pb-14">

        {/* FORM */}
        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl"
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Battery Finder
              </h3>

              <p className="mt-1 text-slate-500">
                Enter specifications or describe your use case.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-3 text-white shadow-lg">
              <div className="font-semibold">
                Built for

              </div>

              <div className="font-semibold">
                Intelligent Recommendations
              </div>
            </div>
          </div>

          {/* GRID */}
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <Field label="Length (mm)">
              <input
                type="number"
                value={fields.length_mm}
                onChange={update("length_mm")}
                className={inputCls}
                placeholder="238"
              />
            </Field>

            <Field label="Width (mm)">
              <input
                type="number"
                value={fields.width_mm}
                onChange={update("width_mm")}
                className={inputCls}
                placeholder="129"
              />
            </Field>

            <Field label="Height (mm)">
              <input
                type="number"
                value={fields.height_mm}
                onChange={update("height_mm")}
                className={inputCls}
                placeholder="227"
              />
            </Field>

            <Field label="Reference AH">
              <input
                type="number"
                value={fields.ref_ah}
                onChange={update("ref_ah")}
                className={inputCls}
                placeholder="50"
              />
            </Field>

            <Field label="CCA">
              <input
                type="number"
                value={fields.cca}
                onChange={update("cca")}
                className={inputCls}
                placeholder="400"
              />
            </Field>

            <Field label="CA">
              <input
                type="number"
                value={fields.ca}
                onChange={update("ca")}
                className={inputCls}
                placeholder="500"
              />
            </Field>

            <Field label="RC (mins)">
              <input
                type="number"
                value={fields.rc_mins}
                onChange={update("rc_mins")}
                className={inputCls}
                placeholder="80"
              />
            </Field>

            <Field label="BCI Group">
              <input
                value={fields.bci_group}
                onChange={update("bci_group")}
                className={inputCls}
                placeholder="51/51R"
              />
            </Field>

            <Field label="Terminal Type">
              <select
                value={fields.terminal}
                onChange={update("terminal")}
                className={inputCls}
              >
                {TERMINALS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>

            <Field label="Battery Series">
              <select
                value={fields.series}
                onChange={update("series")}
                className={inputCls}
              >
                {SERIES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* TEXTAREA */}
          <div className="mt-8">
            <Field label="Describe Your Need">
              <textarea
                value={fields.query}
                onChange={update("query")}
                rows={4}
                className={inputCls}
                placeholder='Example: "Need premium battery for SUV with high cold cranking performance"'
              />
            </Field>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Finding Best Match..."
                : "Find Batteries"}
            </button>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-base font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </form>

        {/* RESULTS */}
        {result && (
          <section className="mt-8 space-y-5">

            <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-cyan-50 p-5 shadow-sm">

              <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-700">
                AI Recommendation Summary
              </div>

              <p className="text-base leading-7 text-slate-700">
                {result.summary}
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {result.recommendations.map((r) => (
                <div
                  key={`${r.rank}-${r.battery_model}`}
                  className="transition duration-300 hover:-translate-y-1"
                >
                  <RecommendationCard
                    rec={r}
                    inputFields={fields}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/20 bg-white/50 py-8 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          Connected to{" "}
          <span className="font-mono font-medium text-slate-700">
            {baseUrl}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;