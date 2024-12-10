import { globals } from "./default";
// ------------------------------------------------------------------------------- 
import "/src/styles/documentation/documentation.scss";
// ------------------------------------------------------------------------------- 
const windowsizemenu = 900;
// ------------------------------------------------------------------------------- 
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener('resize', () => globals.actions.monitoreMenu(windowsizemenu));
// ------------------------------------------------------------------------------- 
const shownav = document.getElementById("show-nav")!;
const stickynav = document.getElementById("sticky-nav")!;

const switchnav = () => {
    const components = [shownav, stickynav];
    const states = ["expanded", "retracted"];

    if(shownav.classList.contains(states[0])) {
        components.forEach(element => {
            element.classList.remove(states[0]);
            element.classList.add(states[1]);
        })
    }
    else {
        components.forEach(element => {
            element.classList.remove(states[1]);
            element.classList.add(states[0]);
        })
    }
};

shownav.addEventListener('click', switchnav);