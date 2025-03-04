import { globals } from "./default";
// -----------------------------------------------------------------------------------
import "/src/styles/documentation/documentation.scss";
// -----------------------------------------------------------------------------------
const windowsizemenu = 860;
const windowsizenav = 1050;
// -----------------------------------------------------------------------------------
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener("resize", () => globals.actions.monitoreMenu(windowsizemenu));
// -----------------------------------------------------------------------------------
const shownav = document.getElementById("show-nav")!;
const stickynav = document.getElementById("sticky-nav")!;
// -----------------------------------------------------------------------------------
const components = [shownav, stickynav];

const switchnav = () => components.forEach(element => element.classList.toggle("expanded"));

const areExpanded = () => {
    return shownav.classList.contains("expanded") || stickynav.classList.contains("expanded");
}
// -----------------------------------------------------------------------------------
const clickEvent = (e: MouseEvent) => {
    const element = e.target as Element;

    if(areExpanded()) {
        const notTarget = !stickynav.contains(element) || stickynav.isSameNode(element);

        if(notTarget) switchnav();
    }
}

const escEvent = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if(key === "escape" && areExpanded()) switchnav();
}
// -----------------------------------------------------------------------------------
const switchEvents = () => {
    if(window.innerWidth > windowsizenav) {
        document.removeEventListener("click", clickEvent);
        document.removeEventListener("keydown", escEvent);
    }
    else {
        document.addEventListener("click", clickEvent);
        document.addEventListener("keydown", escEvent);
    }
}
// -----------------------------------------------------------------------------------
switchEvents();
shownav.addEventListener("click", switchnav);
window.addEventListener("resize", switchEvents);