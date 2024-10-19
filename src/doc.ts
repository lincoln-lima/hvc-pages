import { globals } from "./default";
// ------------------------------------------------------------------------------- 
import "/src/styles/documentation/documentation.scss"
// ------------------------------------------------------------------------------- 
window.addEventListener('resize', () => globals.actions.monitoreMenu(900));
window.addEventListener('load', () => globals.actions.monitoreMenu(900));