import { globals } from "./default";
// -----------------------------------------------------------------------------------
import "/src/styles/documentation/documentation.scss";
// -----------------------------------------------------------------------------------
const windowsizemenu = 860;
// -----------------------------------------------------------------------------------
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener("resize", () => globals.actions.monitoreMenu(windowsizemenu));
// -----------------------------------------------------------------------------------
const shownav = document.getElementById("show-nav")!;
const stickynav = document.getElementById("sticky-nav")!;
// -----------------------------------------------------------------------------------
const components = [shownav, stickynav];

const areExpanded = () => {
    return shownav.classList.contains("expanded") || stickynav.classList.contains("expanded");
}

const switchnav = () => {
    components.forEach(element => element.classList.toggle("expanded"));
}
// -----------------------------------------------------------------------------------
shownav.addEventListener("click", switchnav);
// -----------------------------------------------------------------------------------
document.addEventListener("click", e => {
    const element = e.target as Element;
    
    if(areExpanded()) {
        const notTarget = !stickynav.contains(element) || stickynav.isSameNode(element);

        if(notTarget) switchnav();
    }
});

document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();

    if(key === "escape" && areExpanded()) switchnav();
});