import { globals } from "./default";
// -----------------------------------------------------------------------------------
import "/src/styles/documentation/documentation.scss";
// -----------------------------------------------------------------------------------
const windowsizemenu = 860;
// -----------------------------------------------------------------------------------
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener('resize', () => globals.actions.monitoreMenu(windowsizemenu));
// -----------------------------------------------------------------------------------
const shownav = document.getElementById("show-nav")!;
const stickynav = document.getElementById("sticky-nav")!;
// -----------------------------------------------------------------------------------
const components = [shownav, stickynav];
const states = ["expanded", "retracted"];

const switchnav = () => {
    if(shownav.classList.contains(states[0])) retract();
    else expand();
}

const retract = () => {
    components.forEach(element => {
        element.classList.replace(states[0], states[1]);
    });
}

const expand = () => {
    components.forEach(element => {
        element.classList.replace(states[1], states[0]);
    });
}
// -----------------------------------------------------------------------------------
shownav.addEventListener('click', switchnav);