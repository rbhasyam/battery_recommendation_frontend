import { useState } from "react";

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative">
      {label && (
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
      )}
      <div className="relative rounded-md border bg-[oklch(0.15_0.02_250)] text-[oklch(0.95_0.01_90)]">
        <button
          onClick={onCopy}
          className="absolute right-2 top-2 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <pre className="overflow-x-auto p-4 pr-20 text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
