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
const scrolltable = document.querySelector(".scroll-table")!;
// ------------------------------------------------------------------------------- 
const dynamics: [string, Element][] = [
    ["table", scrolltable],
    ["footer", document.body]
];

await Promise.all(dynamics.map(async ([key, parent]) => {
    const element = await templates(key);
    globals.actions.translateElement(element);

    parent.appendChild(element);
}));