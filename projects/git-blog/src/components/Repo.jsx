import { createSignal, createResource, For, Show } from "solid-js";

import { ListContent } from "./ListContent";

import { getContent } from "../utils/git-api";

export function Repo(props)
{
  const [showContent, setShowContent] = createSignal(false);
  const [content] = createResource(showContent, async(showContent) => 
  {
    if(!showContent) return;
    
    props.setRepo(props.repoData);
    return await getContent(props.repoData.name, props.repoData.owner, props.repoData.token);
  });

  return (
    <div>
      <div class="hover:cursor-pointer hover:bg-cyan-300 grid grid-cols-2" onClick={() => setShowContent(!showContent())}>
	<p>{props.repoData.title}</p>
	<Show when={showContent()} fallback={<i class='bx bx-right-arrow justify-self-end'></i>}>
	  <i class='bx bx-down-arrow justify-self-end'></i>
	</Show>
	
      </div>

      <Show when={content() && showContent()}>
	<For each={content().data}>
	  {(content) => (
	    <ListContent repoDB={props.repoDB} repoData={props.repoData} content={content} setFile={props.setFile} />
	  )}
	</For>
      </Show>
    </div>
  );
}
