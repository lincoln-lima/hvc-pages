import { globals } from "./global";
// ------------------------------------------------------------------------------- 
globals.menuburger.addEventListener('click', viewMenu);

function viewMenu() {
    if(globals.menumodal.style.visibility == "hidden") {
        globals.menumodal.style.visibility = "visible";
        globals.menumodal.style.opacity = '1';
    }
    else {
        globals.menumodal.style.opacity = '0';
        globals.menumodal.style.visibility = "hidden";
    }
}