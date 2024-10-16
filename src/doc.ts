import { globals } from "./default";
// ------------------------------------------------------------------------------- 
import "/src/styles/documentation/documentation.scss"
// ------------------------------------------------------------------------------- 
window.addEventListener('resize', () => globals.actions.monitoreMenu(1100));
window.addEventListener('load', () => globals.actions.monitoreMenu(1100));