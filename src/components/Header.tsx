"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <svg
              className="h-5 w-5 text-white"
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
          <span className="text-lg font-bold text-white">
            Changelog<span className="text-brand-400">.dev</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/#features"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/#faq"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            FAQ
          </Link>
          <Link href="/app" className="btn-primary text-sm">
            Get Started
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-800 bg-gray-950 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/#features" className="text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>
              Pricing
            </Link>
            <Link href="/#faq" className="text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>
              FAQ
            </Link>
            <Link href="/app" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
