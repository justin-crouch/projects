import { Switch, Match } from "solid-js";

import { File } from "./File";
import { Folder } from "./Folder";

export function ListContent(props)
{
  return (
    <div class="pl-6">
      <Switch>
	<Match when={props.content.type === "dir"}>
	  <Folder repoDB={props.repoDB} repoData={props.repoData} content={props.content} setFile={props.setFile} />
	</Match>
	
	<Match when={props.content.type === "file"}>
	  <File repoDB={props.repoDB} repoData={props.repoData} content={props.content} setFile={props.setFile} />
	</Match>
      </Switch>
    </div>
  );
}
