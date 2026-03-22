import { NextRequest, NextResponse } from "next/server";
import { fetchCommits } from "@/lib/github";
import { generateChangelog } from "@/lib/changelog-generator";

// Simple in-memory rate limiter: max 5 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 5) {
    return false;
  }

  entry.count++;
  return true;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 300_000);

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { repoUrl, token, since } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required." },
        { status: 400 }
      );
    }

    const commits = await fetchCommits(repoUrl, token || "", since || undefined);

    if (commits.length === 0) {
      return NextResponse.json(
        {
          error:
            "No commits found. Check the repository URL, token permissions, and date range.",
        },
        { status: 404 }
      );
    }

    const changelog = generateChangelog(commits);

    return NextResponse.json({ changelog, commitCount: commits.length });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
