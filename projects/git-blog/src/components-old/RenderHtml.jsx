import { For } from "solid-js";

export function RenderHtml(props) {
  return (
    <For each={props.data.split("\n")}>
      {(line) => (
	<div>{line}</div>
      )}
    </For>
  );
}
