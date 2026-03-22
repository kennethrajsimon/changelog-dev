import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/50 bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">
              Changelog<span className="text-brand-400">.dev</span>
            </span>
          </div>

          <nav className="flex gap-6 text-sm text-gray-500">
            <Link href="/#features" className="hover:text-gray-300 transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="hover:text-gray-300 transition-colors">
              Pricing
            </Link>
            <Link href="/#faq" className="hover:text-gray-300 transition-colors">
              FAQ
            </Link>
            <Link href="/app" className="hover:text-gray-300 transition-colors">
              App
            </Link>
          </nav>

          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Changelog.dev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
