import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Changelog.dev — Beautiful changelogs from your Git history",
  description:
    "Stop writing release notes by hand. Connect your repo, generate a polished changelog, share it with your users.",
  openGraph: {
    title: "Changelog.dev",
    description: "Beautiful changelogs from your Git history — in seconds",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
