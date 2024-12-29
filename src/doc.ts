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
const states = ["expanded", "retracted"];

const retract = () => {
    components.forEach(element => element.classList.replace(states[0], states[1]));
}

const expand = () => {
    components.forEach(element => element.classList.replace(states[1], states[0]));
}

const switchnav = () => {
    if(shownav.classList.contains(states[0])) retract();
    else expand();
}
// -----------------------------------------------------------------------------------
shownav.addEventListener("click", switchnav);
// -----------------------------------------------------------------------------------
window.addEventListener("resize", retract);
window.addEventListener("click", e => {
    const element = e.target;
    
    const notTarget = element != shownav;
    const areExpanded = shownav.classList.contains(states[0]) || stickynav.classList.contains(states[0]);

    if(notTarget && areExpanded && !stickynav.contains(element as Node)) retract();
});
// -----------------------------------------------------------------------------------
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    const areExpanded = shownav.classList.contains(states[0]) || stickynav.classList.contains(states[0]);

    if(key === "escape" && areExpanded) retract();
});