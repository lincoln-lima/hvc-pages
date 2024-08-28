import { globals } from "./global";
// ------------------------------------------------------------------------------- 
import "/src/styles/defaults/header.scss";
// ------------------------------------------------------------------------------- 
const switchMenu = () => {
    if(globals.menumodal.style.visibility == "hidden") {
        globals.viewMenu(true);
    }
    else {
        globals.viewMenu(false);
    }
}
// ------------------------------------------------------------------------------- 
globals.menuburger.addEventListener('click', switchMenu);