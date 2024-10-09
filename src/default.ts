import { globals } from "./global";
// ------------------------------------------------------------------------------- 
import "/src/styles/defaults/header.scss";
// ------------------------------------------------------------------------------- 
const switchMenu = () => {
    globals.viewMenu(globals.menumodal.style.visibility == "hidden");
}
// ------------------------------------------------------------------------------- 
globals.menuburger.addEventListener('click', switchMenu);
// ------------------------------------------------------------------------------- 
window.addEventListener('click', e => {
    const element = e.target as Node;
    const burgerblock = globals.menuburger.style.display != "none";
    const modalvisible = globals.menumodal.style.visibility == "visible";

    if(burgerblock && modalvisible && !globals.menuburger.contains(element)) globals.viewMenu(false);
})