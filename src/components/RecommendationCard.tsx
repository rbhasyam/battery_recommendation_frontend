import type { Recommendation, StructuredFields } from "@/lib/api";

const rankStyles: Record<number, { badge: string; ring: string; label: string }> = {
  1: {
    badge: "bg-[var(--color-rank-gold)] text-white",
    ring: "ring-[var(--color-rank-gold)]",
    label: "1st",
  },
  2: {
    badge: "bg-[var(--color-rank-silver)] text-white",
    ring: "ring-[var(--color-rank-silver)]",
    label: "2nd",
  },
  3: {
    badge: "bg-[var(--color-rank-bronze)] text-white",
    ring: "ring-[var(--color-rank-bronze)]",
    label: "3rd",
  },
};

function Pill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="inline-flex flex-col rounded-md bg-muted px-3 py-1.5 text-left">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function CompareRow({
  label,
  input,
  output,
  diff,
}: {
  label: string;
  input: string | number;
  output: string | number;
  diff?: string;
}) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-2 border-b py-2 text-sm items-center">
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">{input || "-"}</span>
      <span className="font-semibold text-foreground">{output}</span>
      <span className="font-semibold text-right text-primary">{diff || "-"}</span>
    </div>
  );
}

function getDifference(input: any, output: any) {
  const inVal = Number(input);
  const outVal = Number(output);

  if (!inVal || !outVal) return "-";

  const diff = outVal - inVal;

  if (diff > 0) return `+${diff}`;
  if (diff < 0) return `${diff}`;
  return "0";
}

export function RecommendationCard({
  rec,
  inputFields,
}: {
  rec: Recommendation;
  inputFields: StructuredFields;
}) {
  const style = rankStyles[rec.rank] ?? rankStyles[3];

  return (
    <div
      className={`rounded-xl border bg-card p-5 shadow-sm ring-1 ${style.ring} ring-opacity-20`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {/* Rank Badge + Match Percentage */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${style.badge}`}
            >
              {style.label}
            </span>

            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
              {rec.match_percentage}% Match
            </span>
          </div>

          <h3 className="mt-2 text-lg font-bold text-foreground">
            {rec.battery_model}
          </h3>

          <p className="text-xs text-muted-foreground">
            {rec.series} series · BCI {rec.bci_group} · {rec.terminal}
          </p>
        </div>
      </div>

      {/* Battery Specs */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill label="Ref Ah" value={rec.ref_ah} />
        <Pill label="CCA @0°F" value={rec.cca_0f} />
        <Pill label="CA @32°F" value={rec.ca_32f} />
        <Pill label="RC mins" value={rec.rc_mins} />
      </div>

      {/* Dimension Comparison */}
      <div className="mt-5 rounded-lg border p-4">
        <h4 className="mb-3 text-sm font-bold text-foreground">
          Dimension Comparison (mm)
        </h4>

        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-2 border-b pb-2 text-[11px] font-semibold uppercase text-muted-foreground">
          <span>Spec</span>
          <span>Input</span>
          <span>Reco</span>
          <span className="text-right">Diff</span>
        </div>

        <CompareRow
          label="Length"
          input={inputFields.length_mm ? `${inputFields.length_mm} mm` : "-"}
          output={`${rec.length_mm} mm`}
          diff={getDifference(inputFields.length_mm, rec.length_mm)}
        />

        <CompareRow
          label="Width"
          input={inputFields.width_mm ? `${inputFields.width_mm} mm` : "-"}
          output={`${rec.width_mm} mm`}
          diff={getDifference(inputFields.width_mm, rec.width_mm)}
        />

        <CompareRow
          label="Height"
          input={inputFields.height_mm ? `${inputFields.height_mm} mm` : "-"}
          output={`${rec.height_mm} mm`}
          diff={getDifference(inputFields.height_mm, rec.height_mm)}
        />
      </div>

      {/* Performance Comparison */}
      <div className="mt-5 rounded-lg border p-4">
        <h4 className="mb-3 text-sm font-bold text-foreground">
          Performance Comparison
        </h4>

        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-2 border-b pb-2 text-[11px] font-semibold uppercase text-muted-foreground">
          <span>Spec</span>
          <span>Input</span>
          <span>Reco</span>
          <span className="text-right">Diff</span>
        </div>

        <CompareRow
          label="Ref Ah"
          input={inputFields.ref_ah ? `${inputFields.ref_ah} Ah` : "-"}
          output={`${rec.ref_ah} Ah`}
          diff={getDifference(inputFields.ref_ah, rec.ref_ah)}
        />

        <CompareRow
          label="CCA"
          input={inputFields.cca ? `${inputFields.cca}` : "-"}
          output={`${rec.cca_0f}`}
          diff={getDifference(inputFields.cca, rec.cca_0f)}
        />

        <CompareRow
          label="CA"
          input={inputFields.ca ? `${inputFields.ca}` : "-"}
          output={`${rec.ca_32f}`}
          diff={getDifference(inputFields.ca, rec.ca_32f)}
        />

        <CompareRow
          label="RC Min"
          input={inputFields.rc_mins ? `${inputFields.rc_mins} mins` : "-"}
          output={`${rec.rc_mins} mins`}
          diff={getDifference(inputFields.rc_mins, rec.rc_mins)}
        />
      </div>

      <p className="mt-4 border-t pt-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Why: </span>
        {rec.why}
      </p>
    </div>
  );
}