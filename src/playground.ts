import global from "./global";
import templates from "./templates";
import drawers from "./drawers";
import hvc from './hvc';
// ------------------------------------------------------------------------------- 
import "/src/styles/defaults/style.scss";
import "/src/styles/playground/playground.scss";
import "/src/styles/playground/modal.scss";
// ------------------------------------------------------------------------------- 
const setModals = async() => {
    return new Promise<void>(resolve => {
        const modals = ['configs', 'card', 'error'];
    
        modals.forEach(async modal => {
            document.body.appendChild(await templates('modal/' + modal));
        });

        setTimeout(resolve, 1000);
    })
}

await setModals();
// ------------------------------------------------------------------------------- 
const globals = global();
// ------------------------------------------------------------------------------- 
drawers(globals);
hvc(globals);
// ------------------------------------------------------------------------------- 
window.addEventListener('resize', () => globals.monitoreMenu(1110));
window.addEventListener('load', () => globals.monitoreMenu(1110));
// ------------------------------------------------------------------------------- 
globals.delay.value = localStorage.getItem("delay") ? (localStorage.getItem("delay"))! : '800';
// ------------------------------------------------------------------------------- 
globals.configs.addEventListener("click", () => globals.displayElement(globals.configmodal));
globals.closeconfigs.addEventListener("click", () => globals.undisplayElement(globals.configmodal));

document.addEventListener("keydown", e => {
    if(e.key.toLocaleLowerCase() === "f12") {
        e.preventDefault();

        globals.viewElement(globals.configmodal, globals.configmodal.style.display === 'none');
    }
});

window.addEventListener("click", e => {
    if(e.target == globals.configmodal) globals.undisplayElement(globals.configmodal);
});
// ------------------------------------------------------------------------------- 
globals.closeerrors.addEventListener('click', () => globals.undisplayElement(globals.errorsmodal));
// ------------------------------------------------------------------------------- 
console.log(document.getElementById('config-modal'));