import { Show, For, createResource, createMemo, createSignal } from "solid-js";

import { Error } from "./Error";
import { Repo } from "./Repo";

import { getContent } from "../utils/git-api";
import { getRepoEntries, appendRepoEntry } from "../utils/repo-db-api";

export function ListRepos(props)
{
  const [repos] = createResource(props.repoDB, async(repoDB) => await getRepoEntries(repoDB));
  const [showRepoForm, setShowRepoForm] = createSignal(true);

  const [formTitle, setFormTitle] = createSignal();
  const [formName, setFormName] = createSignal();
  const [formOwner, setFormOwner] = createSignal();
  const [formToken, setFormToken] = createSignal();

  function setRepo(repoData)
  {
    
  }

  return (
    <div class="h-full w-2/12 bg-slate-200 text-nowrap">

      <nav class={"w-full overflow-hidden bg-slate-300 grid grid-cols-1 sticky top-0 left-0 " + (showRepoForm()? "h-30" : "h-10")}>
	<div class="flex h-10">
	  <i class={'bx bx-md self-center hover:cursor-pointer ' + (showRepoForm()? "bxs-plus-circle": "bx-plus-circle")} onClick={() => setShowRepoForm(!showRepoForm())}></i>
	</div>

	<div class="w-full h-full grid grid-cols-1 gap-1">
	  <input class="w-full pl-1" type="text" placeholder={formTitle() || "Display Name"} />
	  <input class="w-full pl-1" type="text" placeholder={formName() || "Repo Name"} />
	  <input class="w-full pl-1" type="text" placeholder={formOwner() || "Repo Owner"} />
	  <input class="w-full pl-1" type="text" placeholder={formToken() || "Token"} />
	  <button class="bg-slate-400">Add Repo</button>
	</div>
      </nav>
      
      <div class="w-full text-nowrap bg-slate-200 overflow-auto">
      <Show when={repos()} fallback={<Error />}>
	<For each={repos()}>
	  {(repoData) => (
	    <Repo repoDB={props.repoDB} repoData={repoData} setRepo={props.setRepo} setFile={props.setFile} />
	  )}
	</For>
      </Show>
      </div>

    </div>
  );
}
