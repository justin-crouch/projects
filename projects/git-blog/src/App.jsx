import { invoke } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";

import { createResource, createSignal, createMemo, Show } from "solid-js";

import { ListRepos } from "./components/ListRepos";

import { loadDB } from "./utils/repo-db-api";
import { Error } from "./components/Error";

function App() {
  const [repoDB] = createResource(async() => await loadDB());
  const [usedRepo, setUsedRepo] = createSignal();
  const [usedFile, setUsedFile] = createSignal();

  return (
    <div class="flex h-dvh"> 

      <Show when={repoDB()} fallback={<Error />}>
	<ListRepos repoDB={repoDB()} setRepo={setUsedRepo} setFile={setUsedFile} />
      </Show>

      <Show when={usedRepo() && usedFile()}>
	{createMemo(() => {
	  usedRepo(); usedFile();
	  console.log(usedRepo());
	  console.log(usedFile());
	})}
      </Show>

    </div>
  );
}

export default App;
