import { createResource, Show, For } from "solid-js";
import { Repo } from "./Repo";

export function RepoList(props) {
  const [repos, setRepos] = createResource(props.store, async(store) => await store.get("repos"));

  return (
    <div class="w-3/12 h-full px-2 py-2 text-nowrap overflow-y-auto bg-neutral-300">

    <Show when={repos()} fallback={<p>Loading Repos...</p>}>
      <For each={repos()}>
	{(repo) => (
	  <Repo repo={repo} setSelectedFile={props.setSelectedFile} />
	)}
      </For>
    </Show>

    </div>
  );
}
