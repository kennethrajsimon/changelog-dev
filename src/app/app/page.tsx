"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RepoInput from "@/components/RepoInput";
import ChangelogPreview from "@/components/ChangelogPreview";
import type { ChangelogEntry } from "@/lib/changelog-generator";

const FREE_GENERATION_LIMIT = 5;
const FREE_COMMIT_LIMIT = 20;

function AppContent() {
  const searchParams = useSearchParams();
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [commitCount, setCommitCount] = useState(0);

  useEffect(() => {
    // Check for Pro upgrade from Stripe redirect
    if (searchParams.get("upgraded") === "true") {
      localStorage.setItem("changelog_pro", "true");
      setIsPro(true);
      // Clean up URL
      window.history.replaceState({}, "", "/app");
    }

    // Load existing state
    const proStatus = localStorage.getItem("changelog_pro") === "true";
    setIsPro(proStatus);

    const count = parseInt(localStorage.getItem("changelog_generations") || "0", 10);
    setGenerationCount(count);
  }, [searchParams]);

  const handleGenerate = useCallback(
    async (repoUrl: string, token: string, since: string) => {
      // Check free limit
      if (!isPro && generationCount >= FREE_GENERATION_LIMIT) {
        setError(
          `You've used all ${FREE_GENERATION_LIMIT} free generations. Upgrade to Pro for unlimited access.`
        );
        return;
      }

      setLoading(true);
      setError(null);
      setChangelog([]);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl, token, since: since || undefined }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to generate changelog.");
        }

        let entries: ChangelogEntry[] = data.changelog;

        // Free users: limit commits shown
        if (!isPro) {
          // Trim items to roughly FREE_COMMIT_LIMIT
          let itemCount = 0;
          entries = entries.map((entry) => ({
            ...entry,
            categories: entry.categories
              .map((cat) => {
                const remaining = FREE_COMMIT_LIMIT - itemCount;
                if (remaining <= 0) return { ...cat, items: [] };
                const items = cat.items.slice(0, remaining);
                itemCount += items.length;
                return { ...cat, items };
              })
              .filter((cat) => cat.items.length > 0),
          })).filter((entry) => entry.categories.length > 0);
        }

        setChangelog(entries);
        setCommitCount(data.commitCount);

        // Increment generation count for free users
        if (!isPro) {
          const newCount = generationCount + 1;
          setGenerationCount(newCount);
          localStorage.setItem("changelog_generations", newCount.toString());
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [isPro, generationCount]
  );

  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Could not start checkout.");
      }
    } catch {
      alert("Could not start checkout. Please try again.");
    }
  };

  const remainingGenerations = FREE_GENERATION_LIMIT - generationCount;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-6">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Generate Changelog
            </h1>
            <p className="mt-2 text-gray-400">
              Enter a GitHub repository URL to generate a beautiful, categorized
              changelog from your commit history.
            </p>
          </div>

          {/* Plan status bar */}
          <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isPro
                    ? "bg-brand-500/20 text-brand-400"
                    : "bg-gray-700/50 text-gray-400"
                }`}
              >
                {isPro ? "PRO" : "FREE"}
              </span>
              {!isPro && (
                <span className="text-xs text-gray-500">
                  {remainingGenerations > 0
                    ? `${remainingGenerations} generation${remainingGenerations !== 1 ? "s" : ""} remaining`
                    : "No generations remaining"}
                </span>
              )}
              {isPro && (
                <span className="text-xs text-gray-500">Unlimited generations</span>
              )}
            </div>
            {!isPro && (
              <button
                onClick={handleUpgrade}
                className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
              >
                Upgrade to Pro
              </button>
            )}
          </div>

          {/* Input form */}
          <div className="card p-6">
            <RepoInput
              onGenerate={handleGenerate}
              loading={loading}
              disabled={!isPro && generationCount >= FREE_GENERATION_LIMIT}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
              {error.includes("Upgrade to Pro") && (
                <button
                  onClick={handleUpgrade}
                  className="ml-2 font-medium underline hover:text-red-300"
                >
                  Upgrade now
                </button>
              )}
            </div>
          )}

          {/* Commit count */}
          {commitCount > 0 && changelog.length > 0 && (
            <div className="mt-4 text-xs text-gray-500">
              Processed {commitCount} commit{commitCount !== 1 ? "s" : ""}.
              {!isPro && commitCount > FREE_COMMIT_LIMIT && (
                <span>
                  {" "}
                  Showing first {FREE_COMMIT_LIMIT} items.{" "}
                  <button
                    onClick={handleUpgrade}
                    className="text-brand-400 underline hover:text-brand-300"
                  >
                    Upgrade for full history
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Changelog preview */}
          <ChangelogPreview entries={changelog} isPro={isPro} />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-brand-500" />
        </div>
      }
    >
      <AppContent />
    </Suspense>
  );
}
