import templates from "./templates";
// ------------------------------------------------------------------------------- 
import { globals } from "./default";
// ------------------------------------------------------------------------------- 
import "/src/styles/index/index.scss";
import "/src/styles/defaults/footer.scss";
import "/src/styles/defaults/table.scss";
// ------------------------------------------------------------------------------- 
const windowsizemenu = 860;
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
const commands = document.getElementsByClassName("cmd")!;

Array.from(copies).forEach((copy, i) =>
    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(commands[i].textContent!);
    })
);