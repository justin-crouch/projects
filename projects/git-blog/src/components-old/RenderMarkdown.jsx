import { Converter } from "showdown";
import { CONVERTER_DEFAULT, HOVER_STYLE } from "../globals";

export function RenderMarkdown(props) {
  const converter = new Converter();
  converter.setFlavor(CONVERTER_DEFAULT);

  const xmlContent = props.data.split("---\n");
  const xmlString = (xmlContent.length > 1)? xmlContent[1].split("\n") : ["title: " + props.selectedFile.filePath.split("/").pop()];
  const content = (xmlContent.length > 1)? converter.makeHtml(xmlContent[2]) : converter.makeHtml(xmlContent[0]);

  const xml = {};
  for(const optString of xmlString) {
    if(optString === "") {continue;}
    const opt = optString.split(": ");
    xml[opt[0]] = opt[1];
  }

  const pubOptions = () => {
    if(xml.published && xml.published === "false") {
      return (
	<>
	<option value="true">True</option>
	<option value="false" selected>False</option>
	</>
      );
    }
    return (
      <>
      <option value="true" selected>True</option>
      <option value="false">False</option>
      </>
    );
  };

  return (
    <div>
      <h1 ref={(r) => props.refs("title", r)} class="text-center" contenteditable="true">{xml.title}</h1>

      <div class="grid grid-cols-4 gap-x-4 gap-y-2">
	<p class="text-right">DATE:</p><p ref={(r) => props.refs("date", r)} class={"col-span-3 pl-2 " + HOVER_STYLE} contenteditable="true">{xml.date}</p>
	<p class="text-right">PUBLISHED:</p><select ref={(r) => props.refs("published", r)} class={"col-span-3 pl-2 " + HOVER_STYLE}>
	  {pubOptions()}
  	</select>

	<p class="text-right">DESCRIPTION:</p><p ref={(r) => props.refs("desc", r)} contenteditable="true" class={"col-span-3 pl-2 pr-4 " + HOVER_STYLE}>{xml.description}</p>
      </div>

      <div ref={(r) => props.refs("content", r)} contenteditable="true" innerHTML={content} />
    </div>
  );
}
