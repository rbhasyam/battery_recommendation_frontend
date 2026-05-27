import type { Recommendation, StructuredFields } from "@/lib/api";

const rankStyles: Record<number, { badge: string; ring: string; label: string }> = {
  1: {
    badge: "bg-green-500 text-white",
    ring: "border-green-400",
    label: "1st",
  },
  2: {
    badge: "bg-blue-500 text-white",
    ring: "border-blue-400",
    label: "2nd",
  },
  3: {
    badge: "bg-yellow-600 text-white",
    ring: "border-yellow-500",
    label: "3rd",
  },
};

function Pill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-[#f3f0eb] px-3 py-2 min-w-[58px]">
      <div className="text-[10px] uppercase text-gray-500 font-medium">
        {label}
      </div>

      <div className="text-[22px] leading-none font-bold text-black mt-1">
        {value || "-"}
      </div>
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
    <div className="grid grid-cols-[1.2fr_1fr_1fr_0.7fr] gap-2 border-b border-gray-200 py-3 text-sm items-center">
      <span className="font-semibold text-black">{label}</span>

      <span className="text-gray-600">{input || "-"}</span>

      <span className="font-semibold text-black">{output}</span>

      <span className="text-right font-semibold text-red-500">
        {diff || "-"}
      </span>
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
      className={`rounded-2xl border-2 bg-white p-6 shadow-sm ${style.ring}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {/* Rank + Match */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}
            >
              {style.label}
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              {rec.match_percentage}% Match
            </span>
          </div>

          {/* Battery Name */}
          <h3 className="mt-4 text-[34px] leading-none font-extrabold tracking-tight text-black">
            {rec.battery_model}
          </h3>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-gray-600">
            {rec.series} series · BCI {rec.bci_group} · {rec.terminal}
          </p>
        </div>
      </div>

      {/* Specs */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Pill label="Ref Ah" value={rec.ref_ah} />
        <Pill label="CCA @0°F" value={rec.cca_0f} />
        <Pill label="CA @32°F" value={rec.ca_32f} />
        <Pill label="RC mins" value={rec.rc_mins} />
      </div>

      {/* Dimension Comparison */}
      <div className="mt-6 rounded-2xl border border-gray-300 p-5">
        <h4 className="mb-5 text-[22px] font-bold text-black">
          Dimension Comparison (mm)
        </h4>

        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.7fr] gap-2 border-b border-gray-300 pb-3 text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
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
      <div className="mt-6 rounded-2xl border border-gray-300 p-5">
        <h4 className="mb-5 text-[22px] font-bold text-black">
          Performance Comparison
        </h4>

        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.7fr] gap-2 border-b border-gray-300 pb-3 text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
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

      {/* Why */}
      <div className="mt-5 border-t border-gray-200 pt-4">
        <span className="font-bold text-black">Why: </span>

        <span className="text-gray-600">{rec.why}</span>
      </div>
    </div>
  );
}