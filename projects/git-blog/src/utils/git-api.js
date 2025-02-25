import { Octokit } from "octokit";

export async function getContent(repoName, repoOwner, token, path) {
  const octokit = new Octokit({
    auth: token
  });

  const res = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: repoOwner,
    repo: repoName,
    path: path || "",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
      "Accept": "application/vnd.github.raw+json"
    }
  });

  return res;
}
