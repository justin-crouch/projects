export function File(props)
{
  return (
    <div>
      <p class="hover:cursor-pointer hover:bg-cyan-300" onClick={() => props.setFile(props.content)}>{props.content.name}</p>
    </div>
  );
}
