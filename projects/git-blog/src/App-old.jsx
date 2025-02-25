import { invoke } from "@tauri-apps/api/core";
import { createResource, createSignal, createMemo, Show } from "solid-js";
import { load } from "@tauri-apps/plugin-store";
import { RepoList } from "./components/RepoList";
import { RenderFile } from "./components/RenderFile";
import { API_STORE_NAME } from "./globals";
import { getContentFromPath } from "./git-api";

function App() {
  const [store] = createResource(async() => await load(API_STORE_NAME));

  return (
    <div class="flex h-dvh"> 

      <Show when={store && false} fallback={<p>Loading Database...</p>}>
	{createMemo(() => {
	  store();
	  return <RepoList store={store()} setSelectedFile={setSelectedFile} />;
	})}
      </Show>

      <Show when={file() && false} fallback={<div class="w-9/12 h-full px-4 py-2 bg-neutral-200 overflow-y-auto" />}>
	{createMemo(() => {
	  file();
	  selectedFile();
	  return <RenderFile selectedFile={selectedFile()} data={file()} />;
	})}
      </Show>

    </div>
  );
}

export default App;
