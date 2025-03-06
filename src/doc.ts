import { globals } from "./default";
// -----------------------------------------------------------------------------------
import "/src/styles/documentation/documentation.scss";
// -----------------------------------------------------------------------------------
const windowsizemenu = 860;
const windowsizenav = 1050;
// -----------------------------------------------------------------------------------
globals.monitoreMenu(windowsizemenu);
window.addEventListener("resize", () => globals.monitoreMenu(windowsizemenu));
// -----------------------------------------------------------------------------------
const stickynav = document.querySelector(".sticky-nav")!;
const shownav = stickynav.querySelector(".show-nav")!;
// -----------------------------------------------------------------------------------
const components = [shownav, stickynav];

const switchNav = () => {
    switchExpanded(!areExpanded());
    switchEventsNav(areExpanded());
}

const switchExpanded = (set: boolean) => {
    if(set) components.forEach(element => element.classList.add("expanded"));
    else components.forEach(element => element.classList.remove("expanded"));
}

const monitoreShowNav = () => {
    switchExpanded(false);
    switchEventsNav(false);

    if(window.innerWidth > windowsizenav) shownav.removeEventListener("click", switchNav);
    else shownav.addEventListener("click", switchNav);
}

const areExpanded = () => {
    return shownav.classList.contains("expanded") || stickynav.classList.contains("expanded");
}
// -----------------------------------------------------------------------------------
const clickEventNav = (e: MouseEvent) => {
    const element = e.target as Element;
    const notTarget = !stickynav.contains(element) || stickynav.isSameNode(element);

    if(notTarget) switchNav();
}

const escEventNav = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if(key === "escape") switchNav();
}
// -----------------------------------------------------------------------------------
const switchEventsNav = (set: boolean) => {
    if(set) {
        document.addEventListener("click", clickEventNav);
        document.addEventListener("keydown", escEventNav);
    }
    else {
        document.removeEventListener("click", clickEventNav);
        document.removeEventListener("keydown", escEventNav);
    }
}
// -----------------------------------------------------------------------------------
monitoreShowNav();
window.addEventListener("resize", monitoreShowNav);