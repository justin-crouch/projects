import { createSignal, Switch, Match, For, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { RenderHtml } from "./RenderHtml";
import { RenderMarkdown } from "./RenderMarkdown";
import { Converter } from "showdown";
import { Octokit } from "octokit";
import { CONVERTER_DEFAULT } from "../globals";

export function RenderFile(props) {
  const [refs, setRefs] = createStore({
    title: null,
    date: null,
    published: null,
    desc: null,
    content: null
  });
  let filetype = "none";

  const converter = new Converter();
  converter.setFlavor(CONVERTER_DEFAULT);

  function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
  }

  function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (byte) =>
      String.fromCodePoint(byte),
    ).join("");
    return btoa(binString);
  }

  async function sha1(str) {
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest("SHA-1", enc.encode(str));
    return Array.from(new Uint8Array(hash))
      .map(v => v.toString(16).padStart(2, '0'))
      .join('');
  }

  async function gitApiUpdate(repo, file, content) {
    const octokit = new Octokit({
      auth: repo.token
    });

    const base64 = bytesToBase64(new TextEncoder().encode(content));
    const sha = file.sha;
    
    const res = await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: repo.owner,
      repo: repo.repo,
      path: file.path,
      message: "Update " + file.path,
      content: base64,
      sha: sha,
      headers: {
	"X-GitHub-Api-Version": "2022-11-28",
	"Accept": "application/vnd.github.raw+json"
      }
    });

    if(res.status == 200){
      file.sha = res.data.content.sha;
    }
  }

  async function saveFile() {
    const xml = "---\n" +
      "title: " + refs.title.innerText + "\n" +
      "date: " + refs.date.innerText + "\n" +
      "published: " + refs.published.value + "\n" +
      "description: " + refs.desc.innerText + "\n" +
      "layout: post\n" +
      "---";

    const content = converter.makeMarkdown(refs.content.innerHTML);
    gitApiUpdate(props.selectedFile.repo, props.selectedFile.file, xml + "\n" + content);
  }

  return (
    <div class="w-9/12 h-full bg-neutral-200 overflow-y-auto">

      <nav class="flex px-2 top-0 h-16 w-full bg-slate-100">
	<button onClick={() => saveFile()}><i class='bx bx-save bx-lg place-self-center'></i></button>
      </nav>

      <div class="px-4 py-2">
      <Switch fallback={<h1>File Not Supported</h1>}>
	<Match when={props.selectedFile.filePath.endsWith(".html")}>
	  <RenderHtml selectedFile={props.selectedFile} data={props.data.data} />
	</Match>
	<Match when={props.selectedFile.filePath.endsWith(".md") || props.selectedFile.filePath.endsWith(".markdown")}>
	  <RenderMarkdown refs={setRefs} selectedFile={props.selectedFile} data={props.data.data} />
	  {filetype="markdown"}
	</Match>
      </Switch>
      </div>

      
    </div>
  );
}
