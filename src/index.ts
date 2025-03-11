import "/src/styles/index/index.scss";
import "/src/styles/defaults/table.scss";
import "/src/styles/defaults/footer.scss";
// ------------------------------------------------------------------------------- 
import { monitoreMenu, translateElement } from "./globals";
// ------------------------------------------------------------------------------- 
import templates from "./templates";
// ------------------------------------------------------------------------------- 
const windowsizemenu = 840;
// ------------------------------------------------------------------------------- 
monitoreMenu(windowsizemenu);
window.addEventListener("resize", () => monitoreMenu(windowsizemenu));
// ------------------------------------------------------------------------------- 
const scrolltable = document.querySelector(".scroll-table")!;
// ------------------------------------------------------------------------------- 
const dynamics: [string, Element][] = [
    ["table", scrolltable],
    ["footer", document.body]
];

await Promise.all(dynamics.map(async ([key, parent]) => {
    const element = await templates(key);
    translateElement(element);

    parent.appendChild(element);
}));