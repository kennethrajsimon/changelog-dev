import { Commit } from "./github";

export interface ChangelogCategory {
  name: string;
  badge: string;
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  categories: ChangelogCategory[];
}

const CATEGORY_MAP: Record<string, { name: string; badge: string }> = {
  feat: { name: "New Features", badge: "badge-feature" },
  fix: { name: "Bug Fixes", badge: "badge-fix" },
  docs: { name: "Documentation", badge: "badge-docs" },
  refactor: { name: "Improvements", badge: "badge-improvement" },
  perf: { name: "Performance", badge: "badge-performance" },
  test: { name: "Testing", badge: "badge-testing" },
  tests: { name: "Testing", badge: "badge-testing" },
  chore: { name: "Maintenance", badge: "badge-maintenance" },
  ci: { name: "Maintenance", badge: "badge-maintenance" },
  build: { name: "Maintenance", badge: "badge-maintenance" },
  style: { name: "Improvements", badge: "badge-improvement" },
};

const DEFAULT_CATEGORY = { name: "Changes", badge: "badge-changes" };

function parseCommitMessage(message: string): {
  category: { name: string; badge: string };
  cleanMessage: string;
} {
  // Match conventional commit: type(scope): message  OR  type: message
  const match = message.match(
    /^(\w+)(?:\([^)]*\))?:\s*(.+)/
  );

  if (match) {
    const prefix = match[1].toLowerCase();
    const category = CATEGORY_MAP[prefix] || DEFAULT_CATEGORY;
    let cleanMsg = match[2].trim();
    // Capitalize first letter
    cleanMsg = cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);
    // Remove trailing period
    cleanMsg = cleanMsg.replace(/\.\s*$/, "");
    return { category, cleanMessage: cleanMsg };
  }

  // No conventional commit prefix
  let cleanMsg = message.trim();
  cleanMsg = cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);
  cleanMsg = cleanMsg.replace(/\.\s*$/, "");
  return { category: DEFAULT_CATEGORY, cleanMessage: cleanMsg };
}

function groupByWeek(
  commits: Commit[]
): Map<string, Commit[]> {
  const groups = new Map<string, Commit[]>();

  for (const commit of commits) {
    const date = new Date(commit.date);
    // Get the Monday of the week
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekKey = monday.toISOString().split("T")[0];

    if (!groups.has(weekKey)) {
      groups.set(weekKey, []);
    }
    groups.get(weekKey)!.push(commit);
  }

  return groups;
}

function formatWeekLabel(weekStart: string): string {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", {
    ...opts,
    year: "numeric",
  });

  return `${startStr} — ${endStr}`;
}

export function generateChangelog(commits: Commit[]): ChangelogEntry[] {
  if (commits.length === 0) return [];

  // Sort commits newest first
  const sorted = [...commits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const weekGroups = groupByWeek(sorted);

  // Sort weeks newest first
  const sortedWeeks = Array.from(weekGroups.entries()).sort(
    (a, b) => b[0].localeCompare(a[0])
  );

  const entries: ChangelogEntry[] = [];

  for (const [weekKey, weekCommits] of sortedWeeks) {
    const categoryMap = new Map<
      string,
      { name: string; badge: string; items: string[] }
    >();

    for (const commit of weekCommits) {
      // Use PR title if available, otherwise commit message
      const message = commit.pr_title || commit.message;
      const { category, cleanMessage } = parseCommitMessage(message);

      // Deduplicate merge commits
      if (
        cleanMessage.startsWith("Merge pull request") ||
        cleanMessage.startsWith("Merge branch")
      ) {
        continue;
      }

      if (!categoryMap.has(category.name)) {
        categoryMap.set(category.name, {
          name: category.name,
          badge: category.badge,
          items: [],
        });
      }

      const entry = categoryMap.get(category.name)!;
      // Avoid duplicate messages
      if (!entry.items.includes(cleanMessage)) {
        entry.items.push(cleanMessage);
      }
    }

    // Order categories: Features first, then fixes, then alphabetical
    const categoryOrder = [
      "New Features",
      "Bug Fixes",
      "Improvements",
      "Performance",
      "Documentation",
      "Testing",
      "Maintenance",
      "Changes",
    ];

    const categories = Array.from(categoryMap.values()).sort((a, b) => {
      const ai = categoryOrder.indexOf(a.name);
      const bi = categoryOrder.indexOf(b.name);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    if (categories.length > 0) {
      entries.push({
        version: `Week of ${formatWeekLabel(weekKey)}`,
        date: weekKey,
        categories,
      });
    }
  }

  return entries;
}

export function changelogToMarkdown(
  entries: ChangelogEntry[],
  includeBranding: boolean = true
): string {
  let md = "# Changelog\n\n";

  for (const entry of entries) {
    md += `## ${entry.version}\n\n`;

    for (const cat of entry.categories) {
      md += `### ${cat.name}\n\n`;
      for (const item of cat.items) {
        md += `- ${item}\n`;
      }
      md += "\n";
    }
  }

  if (includeBranding) {
    md += "\n---\n*Generated by [Changelog.dev](https://changelog.dev)*\n";
  }

  return md;
}

export function changelogToHtml(
  entries: ChangelogEntry[],
  includeBranding: boolean = true
): string {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Changelog</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 2rem; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 2rem; margin-bottom: 2rem; background: linear-gradient(to right, #4ade80, #6ee7b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .entry { margin-bottom: 2.5rem; }
  .entry h2 { font-size: 1.25rem; color: #f5f5f5; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #262626; }
  .category { margin-bottom: 1rem; }
  .category h3 { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; display: inline-block; padding: 0.125rem 0.5rem; border-radius: 9999px; }
  .badge-feature { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
  .badge-fix { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .badge-docs { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
  .badge-improvement { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }
  .badge-performance { background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid rgba(168,85,247,0.2); }
  .badge-testing { background: rgba(6,182,212,0.15); color: #22d3ee; border: 1px solid rgba(6,182,212,0.2); }
  .badge-maintenance { background: rgba(163,163,163,0.15); color: #a3a3a3; border: 1px solid rgba(163,163,163,0.2); }
  .badge-changes { background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.2); }
  ul { list-style: none; padding-left: 1rem; }
  li { padding: 0.25rem 0; color: #d4d4d4; }
  li::before { content: "\\2022"; color: #525252; font-weight: bold; display: inline-block; width: 1em; margin-left: -1em; }
  .branding { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #262626; text-align: center; font-size: 0.75rem; color: #525252; }
  .branding a { color: #4ade80; text-decoration: none; }
</style>
</head>
<body>
<h1>Changelog</h1>
`;

  for (const entry of entries) {
    html += `<div class="entry">\n<h2>${entry.version}</h2>\n`;
    for (const cat of entry.categories) {
      html += `<div class="category">\n<h3 class="${cat.badge}">${cat.name}</h3>\n<ul>\n`;
      for (const item of cat.items) {
        html += `<li>${escapeHtml(item)}</li>\n`;
      }
      html += `</ul>\n</div>\n`;
    }
    html += `</div>\n`;
  }

  if (includeBranding) {
    html += `<div class="branding">Generated by <a href="https://changelog.dev">Changelog.dev</a></div>\n`;
  }

  html += `</body>\n</html>`;
  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
