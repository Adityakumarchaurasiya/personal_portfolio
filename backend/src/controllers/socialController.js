function profileLink(envUrl, buildUrl) {
  const url = envUrl?.trim();
  if (url) return url.startsWith("http") ? url : `https://${url.replace(/^\/\//, "")}`;
  return buildUrl?.() || null;
}

async function fetchLeetCodeStats(username) {
  try {
    const query = `
      query userProblemsSolved($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { username } }),
    });
    if (!response.ok) return null;
    const result = await response.json();
    const stats = result?.data?.matchedUser?.submitStats?.acSubmissionNum;
    if (!stats) return null;
    return {
      total: stats.find((s) => s.difficulty === "All")?.count || 0,
      easy: stats.find((s) => s.difficulty === "Easy")?.count || 0,
      medium: stats.find((s) => s.difficulty === "Medium")?.count || 0,
      hard: stats.find((s) => s.difficulty === "Hard")?.count || 0,
    };
  } catch (err) {
    console.warn("LeetCode fetch error:", err.message);
    return null;
  }
}

async function getSocialOverview(_req, res) {
  const linkedinUrl = profileLink(process.env.LINKEDIN_URL);
  const leetcodeUsername = process.env.LEETCODE_USERNAME?.trim() || "";
  const gfgUsername = process.env.GEEKSFORGEEKS_USERNAME?.trim() || "";
  const githubUsername = process.env.GITHUB_USERNAME?.trim() || "";
  const githubUrl =
    profileLink(process.env.GITHUB_URL) ||
    (githubUsername ? `https://github.com/${githubUsername}` : null);

  const handle = (process.env.YOUTUBE_CHANNEL_HANDLE || "").trim().replace(/^@/, "");
  const youtubeUrl = handle ? `https://www.youtube.com/@${handle}` : null;

  let leetcodeStats = null;
  if (leetcodeUsername) {
    leetcodeStats = await fetchLeetCodeStats(leetcodeUsername);
  }

  res.json({
    linkedin: linkedinUrl
      ? { available: true, url: linkedinUrl, label: "LinkedIn" }
      : { available: false },
    leetcode: leetcodeUsername
      ? {
          available: true,
          username: leetcodeUsername,
          url: `https://leetcode.com/u/${leetcodeUsername}/`,
          label: "LeetCode",
          stats: leetcodeStats,
        }
      : { available: false },
    geeksforgeeks: gfgUsername
      ? {
          available: true,
          username: gfgUsername,
          url: `https://www.geeksforgeeks.org/profile/${gfgUsername}`,
          label: "GeeksforGeeks",
        }
      : { available: false },
    github: githubUrl
      ? { available: true, url: githubUrl, username: githubUsername || null }
      : { available: false },
    youtube: youtubeUrl
      ? { available: true, url: youtubeUrl, handle: handle ? `@${handle}` : null }
      : { available: false },
  });
}

module.exports = { getSocialOverview };
