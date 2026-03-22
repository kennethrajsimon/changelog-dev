import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";

const SAMPLE_CHANGELOG = [
  {
    version: "Week of Mar 17 — Mar 23, 2026",
    categories: [
      {
        name: "New Features",
        badge: "badge-feature",
        items: [
          "Add dark mode support across all pages",
          "Implement real-time collaboration for team dashboards",
          "Add CSV and PDF export options for reports",
        ],
      },
      {
        name: "Bug Fixes",
        badge: "badge-fix",
        items: [
          "Fix pagination not resetting on filter change",
          "Resolve memory leak in WebSocket connection handler",
        ],
      },
      {
        name: "Improvements",
        badge: "badge-improvement",
        items: [
          "Refactor authentication middleware for better error handling",
          "Improve loading skeleton animations",
        ],
      },
    ],
  },
  {
    version: "Week of Mar 10 — Mar 16, 2026",
    categories: [
      {
        name: "New Features",
        badge: "badge-feature",
        items: [
          "Launch webhook integrations for Slack and Discord",
          "Add team member invitation flow",
        ],
      },
      {
        name: "Performance",
        badge: "badge-performance",
        items: ["Optimize database queries reducing p99 latency by 40%"],
      },
      {
        name: "Documentation",
        badge: "badge-docs",
        items: ["Add comprehensive API reference with code examples"],
      },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "Do I need to give you write access to my repo?",
    a: "No. We only need read access. A personal access token with the 'repo' scope (for private repos) or no token at all (for public repos) is sufficient. We never write to your repository.",
  },
  {
    q: "Is my token stored anywhere?",
    a: "No. Your token is sent directly to GitHub's API from our server, used once to fetch commits, and immediately discarded. We never log, store, or persist tokens.",
  },
  {
    q: "What commit formats do you support?",
    a: "We parse conventional commits (feat:, fix:, docs:, etc.) automatically. Non-conventional commits are grouped under 'Changes'. We also pull in merged PR titles for better descriptions.",
  },
  {
    q: "Can I use this for private repositories?",
    a: "Yes! Just provide a personal access token with the 'repo' scope. The token gives us temporary read access to fetch your commit history.",
  },
  {
    q: "What's included in the free plan?",
    a: "5 changelog generations per browser, covering the last 20 commits per generation. Changelogs include a small 'Powered by Changelog.dev' footer. Upgrade to Pro for unlimited generations, full history, and no branding.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes, cancel anytime from your Stripe customer portal. You'll keep Pro features until the end of your billing period.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-24">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-sm text-brand-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Instant changelog generation from Git history
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Beautiful changelogs from your{" "}
              <span className="text-gradient">Git history</span>
              {" "}— in seconds
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
              Stop writing release notes by hand. Connect your repo, generate a
              polished changelog, and share it with your users. Works with any
              GitHub repository.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="/app" className="btn-primary text-base px-8 py-4">
                Generate Your Changelog
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="#demo" className="btn-secondary text-base px-8 py-4">
                See Demo
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex items-center justify-center gap-8 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Tokens never stored
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                30-second setup
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Free to start
              </span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="features" className="py-24 border-t border-gray-800/50">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Three steps. Zero friction.
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                From repo URL to polished changelog in under a minute.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Paste your repo URL",
                  description:
                    "Enter any GitHub repository URL — public or private. Optionally add a personal access token for private repos.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  ),
                },
                {
                  step: "02",
                  title: "Generate changelog",
                  description:
                    "We fetch your commits and PRs, parse conventional commits, and organize everything into clean categories.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  ),
                },
                {
                  step: "03",
                  title: "Share with users",
                  description:
                    "Copy as Markdown, download as a styled HTML page, or share a direct link. Embed the widget on your site.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="card p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                    <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {item.icon}
                    </svg>
                  </div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-500">
                    Step {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live demo */}
        <section id="demo" className="py-24 border-t border-gray-800/50">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                See what you get
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                A sample changelog generated from real commit history.
              </p>
            </div>

            <div className="space-y-6">
              {SAMPLE_CHANGELOG.map((entry, idx) => (
                <div key={idx} className="card p-6">
                  <h3 className="mb-4 text-base font-semibold text-white">
                    {entry.version}
                  </h3>
                  <div className="space-y-4">
                    {entry.categories.map((cat, catIdx) => (
                      <div key={catIdx}>
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.badge}`}>
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
          </div>
        </section>

        {/* Pricing */}
        <div className="border-t border-gray-800/50">
          <PricingSection />
        </div>

        {/* FAQ */}
        <section id="faq" className="border-t border-gray-800/50 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => (
                <details
                  key={idx}
                  className="group card overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium text-white hover:bg-gray-800/30 transition-colors">
                    {item.q}
                    <svg
                      className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-gray-800 px-5 py-4 text-sm text-gray-400 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-800/50 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to automate your changelogs?
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Join developers who save hours every release cycle.
            </p>
            <div className="mt-8">
              <a href="/app" className="btn-primary text-base px-8 py-4">
                Start for Free
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
