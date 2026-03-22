export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  pr_title?: string;
  pr_number?: number;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

interface GitHubPR {
  number: number;
  title: string;
  merged_at: string | null;
  merge_commit_sha: string | null;
  user: {
    login: string;
  };
}

export function parseRepoUrl(url: string): { owner: string; repo: string } {
  // Handle formats: https://github.com/owner/repo, github.com/owner/repo, owner/repo
  const cleaned = url
    .replace(/\.git$/, "")
    .replace(/\/$/, "")
    .replace(/^https?:\/\//, "")
    .replace(/^github\.com\//, "");

  const parts = cleaned.split("/");
  if (parts.length < 2) {
    throw new Error(
      "Invalid repository URL. Use format: owner/repo or https://github.com/owner/repo"
    );
  }

  return {
    owner: parts[parts.length - 2],
    repo: parts[parts.length - 1],
  };
}

export async function fetchCommits(
  repoUrl: string,
  token: string,
  since?: string
): Promise<Commit[]> {
  const { owner, repo } = parseRepoUrl(repoUrl);

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Changelog.dev",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Fetch commits
  const commitsUrl = new URL(
    `https://api.github.com/repos/${owner}/${repo}/commits`
  );
  commitsUrl.searchParams.set("per_page", "50");
  if (since) {
    commitsUrl.searchParams.set("since", since);
  }

  const commitsRes = await fetch(commitsUrl.toString(), { headers });
  if (!commitsRes.ok) {
    const errorBody = await commitsRes.text();
    if (commitsRes.status === 401 || commitsRes.status === 403) {
      throw new Error(
        "Authentication failed. Please check your personal access token."
      );
    }
    if (commitsRes.status === 404) {
      throw new Error(
        "Repository not found. Check the URL and ensure the token has access."
      );
    }
    throw new Error(`GitHub API error: ${commitsRes.status} — ${errorBody}`);
  }

  const commitsData: GitHubCommit[] = await commitsRes.json();

  // Fetch merged PRs
  const prsUrl = new URL(
    `https://api.github.com/repos/${owner}/${repo}/pulls`
  );
  prsUrl.searchParams.set("state", "closed");
  prsUrl.searchParams.set("sort", "updated");
  prsUrl.searchParams.set("direction", "desc");
  prsUrl.searchParams.set("per_page", "30");

  let prsData: GitHubPR[] = [];
  try {
    const prsRes = await fetch(prsUrl.toString(), { headers });
    if (prsRes.ok) {
      prsData = (await prsRes.json()).filter(
        (pr: GitHubPR) => pr.merged_at !== null
      );
    }
  } catch {
    // PR fetch is best-effort
  }

  // Build a map of merge commit SHA -> PR info
  const prMap = new Map<string, { title: string; number: number }>();
  for (const pr of prsData) {
    if (pr.merge_commit_sha) {
      prMap.set(pr.merge_commit_sha, {
        title: pr.title,
        number: pr.number,
      });
    }
  }

  // Combine
  const commits: Commit[] = commitsData.map((c) => {
    const prInfo = prMap.get(c.sha);
    return {
      sha: c.sha,
      message: c.commit.message.split("\n")[0], // First line only
      author: c.commit.author.name,
      date: c.commit.author.date,
      ...(prInfo && {
        pr_title: prInfo.title,
        pr_number: prInfo.number,
      }),
    };
  });

  return commits;
}
