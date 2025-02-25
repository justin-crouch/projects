import { createResource, createSignal, Show, Switch, Match, For } from "solid-js";
import { File } from "./File";
import { Octokit } from "octokit";
import { HOVER_BG_COLOR, HOVER_BORDER } from "../globals";

export function Directory(props) {
  const [showDir, setShowDir] = createSignal(false);
  const [tree] = createResource(async() => {
    const octokit = new Octokit({
      auth: props.repo.token
    });

    const res = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: props.repo.owner,
      repo: props.repo.repo,
      path: props.dir.path,
      headers: {
	"X-GitHub-Api-Version": "2022-11-28",
	"Accept": "application/vnd.github.raw+json"
      }
    });

    return res.data;
  });


  return (
    <div>
      <div class={"flex cursor-pointer justify-between hover:" + HOVER_BG_COLOR + " " + HOVER_BORDER} onClick={() => setShowDir( !showDir() )}>
	<span>{props.dir.name}</span>
	<i class={"bx bx-sm " + (showDir()? "bx-chevron-down":"bx-chevron-right")}></i>
      </div>

      <ul class="pl-6">
      <Show when={tree() && showDir()}>
	<For each={tree()}>
	  {(node) => (
	    
	    <Switch>
	      <Match when={node.type === "dir"}>
		<Directory repo={props.repo} dir={node} setSelectedFile={props.setSelectedFile} />
	      </Match>
	      <Match when={node.type === "file"}>
		<File repo={props.repo} file={node} setSelectedFile={props.setSelectedFile} />
	      </Match>
	    </Switch>

	  )}
	</For>
      </Show>
      </ul>

    </div>
  );
}
