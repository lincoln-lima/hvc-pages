import { globals } from "./default";
// ------------------------------------------------------------------------------- 
import "/src/styles/documentation/documentation.scss";
// ------------------------------------------------------------------------------- 
window.addEventListener('resize', () => globals.actions.monitoreMenu(900));
window.addEventListener('load', () => globals.actions.monitoreMenu(900));
// ------------------------------------------------------------------------------- 
const shownav = document.getElementById("show-nav")!;
const stickynav = document.getElementById("sticky-nav")!;

const switchnav = () => {
    const rightnav = stickynav.style['right'];
    const rightshow = shownav.style['right'];
    
    stickynav.style['right'] = rightnav == '0' || rightnav == '' ? '0' : "revert-layer";
    shownav.style['right'] = rightshow == '0' || rightshow == '' ? '0' : stickynav.style['width'];
};

shownav.addEventListener('click', switchnav);