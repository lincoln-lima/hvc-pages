import { globals } from "./default";
// ------------------------------------------------------------------------------- 
import templates from "./templates";
// ------------------------------------------------------------------------------- 
import "/src/styles/index/index.scss";
import "/src/styles/defaults/table.scss";
import "/src/styles/defaults/footer.scss";
// ------------------------------------------------------------------------------- 
const windowsizemenu = 860;
// ------------------------------------------------------------------------------- 
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener("resize", () => globals.actions.monitoreMenu(windowsizemenu));
// ------------------------------------------------------------------------------- 
const scrolltable = document.getElementById("table")!;

const setTemplates = async () => {
    const table = await templates("table");
    const footer = await templates("footer");

    globals.actions.translateElement(table);
    globals.actions.translateElement(footer);

    scrolltable.appendChild(table);
    document.body.appendChild(footer); 
}

await setTemplates();