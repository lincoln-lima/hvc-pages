import templates from "./templates";
// ------------------------------------------------------------------------------- 
import { globals } from "./default";
// ------------------------------------------------------------------------------- 
import "/src/styles/index/index.scss";
import "/src/styles/defaults/footer.scss";
import "/src/styles/defaults/table.scss";
// ------------------------------------------------------------------------------- 
const windowsizemenu = 1000;
// ------------------------------------------------------------------------------- 
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener('resize', () => globals.actions.monitoreMenu(windowsizemenu));
// ------------------------------------------------------------------------------- 
const setTemplates = async () => {
    document.getElementById("table")!.appendChild(await templates('table'));
    document.body.appendChild(await templates('footer')); 
}

await setTemplates();
// ------------------------------------------------------------------------------- 
const copies = document.getElementsByClassName("copy")!;

const copyCode = (id: string) => {
    const copyid = (id.split('-').shift()! + '-cmd');
    const copytext = document.getElementById(copyid)!.innerHTML;

    navigator.clipboard.writeText(copytext);

    alert("Texto copiado para área de transferência:\n" + copytext);
}

Array.from(copies).forEach(copy =>
    copy.addEventListener('click', () => copyCode(copy.id))
);