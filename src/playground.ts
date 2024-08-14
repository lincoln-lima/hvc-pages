import { globals } from "./global";
// ------------------------------------------------------------------------------- 
import "/src/styles/modal.scss";
// ------------------------------------------------------------------------------- 
window.addEventListener('resize', () => globals.monitoreMenu(939));
window.addEventListener('load', () => globals.monitoreMenu(939));
// ------------------------------------------------------------------------------- 
globals.delay.value = (localStorage.getItem("delay")) ? (localStorage.getItem("delay"))! : '700';
// ------------------------------------------------------------------------------- 
document.addEventListener("keydown", e => { // evento de click para abrir configurações
    if(e.key.toLocaleLowerCase() === "f12") {
        e.preventDefault();

        if(!(globals.configmodal.style.display)) globals.displayElement(globals.configmodal);
        else globals.undisplayElement(globals.configmodal);
    }
});

globals.configs.addEventListener("click", () => globals.displayElement(globals.configmodal));

globals.closeconfigs.addEventListener("click", () => globals.undisplayElement(globals.configmodal));

window.addEventListener("click", e => {
    if(e.target == globals.configmodal) globals.undisplayElement(globals.configmodal);
});