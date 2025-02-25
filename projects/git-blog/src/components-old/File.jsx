import { createResource, Show } from "solid-js";
import { HOVER_BG_COLOR, HOVER_BORDER } from "../globals";

export function File(props) {
  return (
    <div class={"cursor-pointer hover:" + HOVER_BG_COLOR + " " + HOVER_BORDER}>
      <p onClick={() => props.setSelectedFile( {file: props.file, filePath: props.file.path, repo: props.repo} )}>{props.file.name}</p>
    </div>
  );
}
