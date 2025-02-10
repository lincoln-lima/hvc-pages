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
const table = document.getElementById("table")!;

const setTemplates = async () => {
    table.appendChild(await templates("table"));
    document.body.appendChild(await templates("footer")); 
}

await setTemplates();