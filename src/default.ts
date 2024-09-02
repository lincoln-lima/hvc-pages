import { globals } from "./global";
// ------------------------------------------------------------------------------- 
import "/src/styles/defaults/header.scss";
// ------------------------------------------------------------------------------- 
const switchMenu = () => {
    globals.viewMenu(globals.menumodal.style.visibility == "hidden");
}
// ------------------------------------------------------------------------------- 
globals.menuburger.addEventListener('click', switchMenu);