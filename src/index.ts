import { globals } from "./global";
import { table, footer } from "./templates";
// ------------------------------------------------------------------------------- 
import "/src/styles/defaults/footer.scss";
import "/src/styles/index/table.scss";
// ------------------------------------------------------------------------------- 
window.addEventListener('resize', () => globals.monitoreMenu(1064));
window.addEventListener('load', () => globals.monitoreMenu(1064));
// ------------------------------------------------------------------------------- 
(async () => {
    document.getElementById("table")!.appendChild(await table());
    document.body.appendChild(await footer()); 
})();
// ------------------------------------------------------------------------------- 
const copies = document.getElementsByClassName("copiar")!;

const copyCode = (id: string) => {
    const copyid = (id.split('-').shift()! + '-cmd');
    const copytext = document.getElementById(copyid)!.innerHTML;

    navigator.clipboard.writeText(copytext);

    alert("Texto copiado para área de transferência:\n" + copytext);
}

Array.from(copies).forEach(copy =>
    copy.addEventListener('click', () => copyCode(copy.id))
);