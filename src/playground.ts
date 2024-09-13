import { globals } from "./default";
import { getDoc, setDoc } from "./codemirror"
// ------------------------------------------------------------------------------- 
import hvc from './hvc';
import drawers from "./drawers";
import templates from "./templates";
// ------------------------------------------------------------------------------- 
import "/src/styles/defaults/style.scss";
import "/src/styles/playground/playground.scss";
import "/src/styles/playground/modal.scss";
// ------------------------------------------------------------------------------- 
export const play = {
    elements: {
        saida: () => { return document.getElementById("saida-span")! },
        acumulador: () => { return document.getElementById("acumulador-span-valor")! },
        epi: () => { return document.getElementById("epi-span")! },
        card: () => { return document.getElementById("cartao")! as HTMLInputElement },
        
        run: () => { return document.getElementById("run")! },
        debug: () => { return document.getElementById("debug")! },
        import: () => { return document.getElementById("import")! },
        export: () => { return document.getElementById("export")! },

        state: () => { return document.getElementById("state")! },
        hvmstate: () => { return document.getElementById("hvm-state")! },

        configmodal: () => { return document.getElementById("config-modal")! },
        cardmodal: () => { return document.getElementById("card-modal")! },
        errorsmodal: () => { return document.getElementById("error-modal")! },
    
        configs: () => { return  document.getElementById("config")! },
        saveconfigs: () => { return document.getElementById("save-configs")! },
        closeconfigs: () => { return document.getElementById("close-configs")! },
    
        submitcard: () => { return document.getElementById("submit-card")! },
    
        error: () => { return document.getElementById("error")! },
        closeerrors: () => { return document.getElementById("close-error")! },

        delay: () => { return document.getElementById("delay")! as HTMLInputElement },
    
        gaveteiro: () => { return document.getElementById("gaveteiro")! },
        gavetas: () => { return document.getElementsByClassName("gaveta")! },
        contentgavetas: () => { return document.getElementsByClassName("cont-gaveta")! }
    },
    actions: {
        setState: (state: string) => {
            let dotclass;
    
            if(state === 'carga') dotclass = 'loading';
            else if(state === 'depuração') dotclass = 'running';
            else dotclass = 'stopped';
    
            play.elements.state().className = dotclass;
            play.elements.hvmstate().innerText = state;
        },
    
        detectError: (message: string) => {
            play.elements.error().innerText = message;
            globals.actions.showElement(play.elements.errorsmodal(), true);
        },
    
        getCode: () => {
            return getDoc();
        },
        
        setCode: (text: string) => {
            setDoc(text);
        },
    
        highlightDrawer: (drawer: HTMLElement, state: string) => {
            drawer.className = 'gaveta '+state;
        },
    }
}
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
await drawers(play.elements.gaveteiro());
hvc();
// ------------------------------------------------------------------------------- 
window.addEventListener('load', () => globals.actions.monitoreMenu(1110));
window.addEventListener('resize', () => globals.actions.monitoreMenu(1110));
// ------------------------------------------------------------------------------- 
play.elements.delay().value = localStorage.getItem("delay") ? (localStorage.getItem("delay"))! : '800';
// ------------------------------------------------------------------------------- 
play.elements.configs().addEventListener("click", () => globals.actions.showElement(play.elements.configmodal(), true));
play.elements.closeconfigs().addEventListener("click", () => globals.actions.showElement(play.elements.configmodal(), false));

document.addEventListener("keydown", e => {
    if(e.key.toLocaleLowerCase() === "f12") {
        const config = play.elements.configmodal();
        e.preventDefault();

        globals.actions.showElement(config, config.style.visibility === 'hidden');
    }
});

window.addEventListener("click", e => {
    if(e.target == play.elements.configmodal()) globals.actions.showElement(play.elements.configmodal(), false);
});
// ------------------------------------------------------------------------------- 
play.elements.closeerrors().addEventListener('click', () => globals.actions.showElement(play.elements.errorsmodal(), false));