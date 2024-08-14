import { globals } from "./global";
// ------------------------------------------------------------------------------- 
window.addEventListener('resize', () => globals.monitoreMenu(1064));
window.addEventListener('load', () => globals.monitoreMenu(1064));
// ------------------------------------------------------------------------------- 
const copies = document.getElementsByClassName("copiar")!;

Array.from(copies).forEach(copy =>
    copy.addEventListener('click', () => copyCode(copy.id))
);

function copyCode(id: string) {
    let copyid = (id.split('-').shift()! + '-cmd');
    let copytext = document.getElementById(copyid)!.innerHTML;

    navigator.clipboard.writeText(copytext);

    alert("Copiado para área de transferência:\n" + copytext);
}