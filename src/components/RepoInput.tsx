"use client";

import { useState } from "react";

interface RepoInputProps {
  onGenerate: (repoUrl: string, token: string, since: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const DATE_RANGES = [
  { label: "Last week", value: "week" },
  { label: "Last month", value: "month" },
  { label: "Last quarter", value: "quarter" },
  { label: "All time", value: "all" },
];

function getSinceDate(range: string): string | undefined {
  const now = new Date();
  switch (range) {
    case "week":
      now.setDate(now.getDate() - 7);
      return now.toISOString();
    case "month":
      now.setMonth(now.getMonth() - 1);
      return now.toISOString();
    case "quarter":
      now.setMonth(now.getMonth() - 3);
      return now.toISOString();
    case "all":
      return undefined;
    default:
      now.setMonth(now.getMonth() - 1);
      return now.toISOString();
  }
}

export default function RepoInput({ onGenerate, loading, disabled }: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [token, setToken] = useState("");
  const [dateRange, setDateRange] = useState("month");
  const [showTokenHelp, setShowTokenHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    const since = getSinceDate(dateRange);
    onGenerate(repoUrl.trim(), token.trim(), since || "");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Repo URL */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          GitHub Repository URL
        </label>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          className="input-field"
          required
        />
      </div>

      {/* Token */}
      <div>
        <div className="mb-1.5 flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300">
            Personal Access Token
          </label>
          <span className="text-xs text-gray-500">(optional for public repos)</span>
          <button
            type="button"
            onClick={() => setShowTokenHelp(!showTokenHelp)}
            className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-600 text-[10px] text-gray-400 hover:border-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Token help"
          >
            ?
          </button>
        </div>
        {showTokenHelp && (
          <div className="mb-2 rounded-lg border border-gray-700 bg-gray-800/50 p-3 text-xs text-gray-400">
            <p className="mb-1 font-medium text-gray-300">How to create a token:</p>
            <ol className="list-decimal space-y-0.5 pl-4">
              <li>
                Go to{" "}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 underline"
                >
                  GitHub Settings &rarr; Tokens
                </a>
              </li>
              <li>Click &quot;Generate new token (classic)&quot;</li>
              <li>Select the <code className="rounded bg-gray-700 px-1">repo</code> scope</li>
              <li>Copy and paste the token here</li>
            </ol>
            <p className="mt-2 text-gray-500">
              Your token is only sent to GitHub&apos;s API. We never store it.
            </p>
          </div>
        )}
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          className="input-field font-mono text-xs"
        />
      </div>

      {/* Date range */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Date Range
        </label>
        <div className="flex flex-wrap gap-2">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => setDateRange(range.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                dateRange === range.value
                  ? "bg-brand-500/20 text-brand-400 ring-1 ring-brand-500/40"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || disabled || !repoUrl.trim()}
        className="btn-primary w-full"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </span>
        ) : (
          "Generate Changelog"
        )}
      </button>
    </form>
  );
}
