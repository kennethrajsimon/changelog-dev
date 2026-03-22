"use client";

import { useState } from "react";

export default function PricingSection() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Free */}
          <div className="card p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Free</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="ml-2 text-gray-500">/month</span>
              </div>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "5 changelog generations",
                "Last 20 commits per generation",
                "Copy as Markdown",
                "Download as HTML",
                "\"Powered by Changelog.dev\" footer",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <a href="/app" className="btn-secondary w-full text-center block">
              Get Started Free
            </a>
          </div>

          {/* Pro */}
          <div className="card relative overflow-hidden border-brand-500/30 p-8">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
            <div className="absolute right-4 top-4 rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-medium text-brand-400">
              Popular
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">$12</span>
                <span className="ml-2 text-gray-500">/month</span>
              </div>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "Unlimited changelog generations",
                "Full commit history",
                "No branding watermark",
                "Embeddable widget",
                "Custom domain support",
                "Priority support",
                "Copy as Markdown",
                "Download as HTML",
                "Shareable links",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Loading..." : "Upgrade to Pro"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
