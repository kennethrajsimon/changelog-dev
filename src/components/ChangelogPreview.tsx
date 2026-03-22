"use client";

import { useState } from "react";
import type { ChangelogEntry } from "@/lib/changelog-generator";
import { changelogToMarkdown, changelogToHtml } from "@/lib/changelog-generator";

interface ChangelogPreviewProps {
  entries: ChangelogEntry[];
  isPro: boolean;
}

export default function ChangelogPreview({ entries, isPro }: ChangelogPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const includeBranding = !isPro;

  const handleCopyMarkdown = async () => {
    const md = changelogToMarkdown(entries, includeBranding);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const html = changelogToHtml(entries, includeBranding);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "changelog.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    // Store in sessionStorage and navigate to view page
    const data = JSON.stringify({ entries, isPro });
    sessionStorage.setItem("changelog_preview", data);
    const id = Date.now().toString(36);
    sessionStorage.setItem(`changelog_${id}`, data);
    const url = `${window.location.origin}/changelog/${id}`;
    navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
    // Open in new tab
    window.open(`/changelog/${id}`, "_blank");
  };

  if (entries.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Your Changelog</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="btn-secondary text-xs px-3 py-2"
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Markdown
              </span>
            )}
          </button>
          <button
            onClick={handleDownloadHtml}
            className="btn-secondary text-xs px-3 py-2"
          >
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download HTML
            </span>
          </button>
          <button
            onClick={handleShare}
            className="btn-secondary text-xs px-3 py-2"
          >
            {shared ? (
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Link Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Link
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Changelog entries */}
      <div className="space-y-6">
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className="card p-6 animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                {entry.version}
              </h3>
              <span className="text-xs text-gray-500">{entry.date}</span>
            </div>

            <div className="space-y-4">
              {entry.categories.map((cat, catIdx) => (
                <div key={catIdx}>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.badge}`}
                  >
                    {cat.name}
                  </span>
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {cat.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="relative text-sm text-gray-300 before:absolute before:-left-3 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-gray-600"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Branding footer for free users */}
      {includeBranding && (
        <div className="mt-6 text-center text-xs text-gray-600">
          Generated by{" "}
          <a href="/" className="text-brand-500 hover:text-brand-400 transition-colors">
            Changelog.dev
          </a>
        </div>
      )}
    </div>
  );
}
