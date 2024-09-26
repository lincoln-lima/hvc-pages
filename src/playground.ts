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
import "/src/styles/index/table.scss";
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
        helpmodal: () => { return document.getElementById('help-modal')! },
    
        configs: () => { return  document.getElementById("config")! },
        saveconfigs: () => { return document.getElementById("save-configs")! },
        closeconfigs: () => { return document.getElementById("close-configs")! },
    
        submitcard: () => { return document.getElementById("submit-card")! },
    
        error: () => { return document.getElementById("error")! },
        closeerrors: () => { return document.getElementById("close-error")! },

        help: () => { return document.getElementById('help')! },

        delay: () => { return document.getElementById("delay")! as HTMLInputElement },
    
        gaveteiro: () => { return document.getElementById("gaveteiro")! },
        gavetas: () => { return document.getElementsByClassName("gaveta")! },
        contentgavetas: () => { return document.getElementsByClassName("cont-gaveta")! }
    },
    actions: {
        setState: (state: string) => {
            let dotclass;
    
            if(state === 'carga') dotclass = 'loading';
            else if(state === 'execução') dotclass = 'running';
            else dotclass = 'stopped';
    
            play.elements.state().className = dotclass;
            play.elements.hvmstate().innerText = state;
        },
    
        detectError: (message: string) => {
            play.elements.error().innerText = message;
            globals.actions.displayElement(play.elements.errorsmodal());
        },
    
        getCode: () => {
            return getDoc();
        },
        
        setCode: (text: string) => {
            setDoc(text);
        },
    
        highlightDrawer: (drawer: HTMLElement, state: string) => {
            drawer.classList.remove(drawer.classList.item(1)!);
            drawer.classList.add(state);
        },
    }
}
// ------------------------------------------------------------------------------- 
window.addEventListener('resize', () => globals.actions.monitoreMenu(1110));
window.addEventListener('load', () => globals.actions.monitoreMenu(1110));
// ------------------------------------------------------------------------------- 
const setModals = async() => {
    return new Promise<void>(resolve => {
        const modals = ['configs', 'card', 'error', 'help'];
    
        modals.forEach(async modal => {
            const element = await templates('modal/' + modal);
            element.style['display'] = 'none';

            document.body.appendChild(element);
        });

        setTimeout(resolve, 1000);
    })
}

await setModals();
play.elements.helpmodal().firstElementChild!.appendChild(await templates('table'));
// ------------------------------------------------------------------------------- 
await drawers(play.elements.gaveteiro());
hvc();
// ------------------------------------------------------------------------------- 
play.elements.delay().value = localStorage.getItem("delay") ? (localStorage.getItem("delay"))! : '800';
// ------------------------------------------------------------------------------- 
play.elements.configs().addEventListener("click", () => globals.actions.displayElement(play.elements.configmodal()));
play.elements.closeconfigs().addEventListener("click", () => globals.actions.undisplayElement(play.elements.configmodal()));
play.elements.saveconfigs().addEventListener('click', () => {
    localStorage.setItem("delay", play.elements.delay().value);

    globals.actions.undisplayElement(play.elements.configmodal());
    alert("As configurações foram salvas!");
});

document.addEventListener("keydown", e => {
    if(e.ctrlKey && e.key.toLowerCase() === "f12") {
        e.preventDefault();
        const config = play.elements.configmodal();

        globals.actions.switchDisplay(config, config.style['display'] === 'none');
    }
});

window.addEventListener("click", e => {
    if(e.target == play.elements.configmodal()) globals.actions.undisplayElement(play.elements.configmodal());
});
// ------------------------------------------------------------------------------- 
play.elements.closeerrors().addEventListener('click', () => globals.actions.undisplayElement(play.elements.errorsmodal()));
// ------------------------------------------------------------------------------- 
const switchHelp = () => {
    const element = play.elements.helpmodal();
    const display = element.style['display'] === 'none';
    
    globals.actions.switchDisplay(element, display);
}

play.elements.help().addEventListener('click', switchHelp);
document.addEventListener('keydown', e => {
    if(!e.ctrlKey && e.key.toLowerCase() === 'f12') {
        e.preventDefault();
        switchHelp();
    }
})