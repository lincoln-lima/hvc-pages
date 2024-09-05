import { getDoc, setDoc } from "./codemirror"

export const globals = {
    /* áreas da página */
    menumodal: document.getElementsByTagName("menu")[0]!,
    configmodal: document.getElementById("config-modal")!,
    cardmodal: document.getElementById("cartao-modal")!,

    /* áreas de texto */
    saida: document.getElementById("saida-span")!,
    acumulador: document.getElementById("acumulador-span-valor")!,
    epi: document.getElementById("epi-span")!,
    card: document.getElementById("cartao")! as HTMLInputElement,

    /* botões da página - ações de clique */
    menuburger: document.getElementsByClassName("botao-menu")[0]! as HTMLElement,

    containerstate: document.getElementById("hvm-state")!,
    hvmstate: document.getElementById("state-value")!,
    dot: document.getElementsByClassName("dot")[0]! as HTMLElement,
    
    run: document.getElementById("run")!,
    debug: document.getElementById("debug")!,
    import: document.getElementById("import")!,
    export: document.getElementById("export")!,

    configs: document.getElementById("config")!,
    saveconfigs: document.getElementById("save-configs")!,
    closeconfigs: document.getElementById("close-configs")!,

    submitcard: document.getElementById("submit-card")!,

    /* área de configuração */
    delay: document.getElementById("delay")! as HTMLInputElement,

    /* armazena gavetas */
    gaveteiro: document.getElementById("gaveteiro")!,
    gavetas: document.getElementsByClassName("gaveta")!,
    contentgavetas: document.getElementsByClassName("cont-gaveta")!, 
    numgavs: 100,

    setStateStyle: (state: string) => {
        let animation = 'grow 0.8s infinite';
        let backgroundcolor;

        if(state === 'carga') backgroundcolor = 'darkgoldenrod';
        else if(state === 'execução') backgroundcolor = 'green'
        else {
            backgroundcolor = 'revert-layer';
            animation = 'inherit';
        }

        globals.containerstate.style.backgroundColor = backgroundcolor;
        globals.hvmstate.innerText = state;
        globals.dot.style.animation = animation;
    },

    highlightDrawer: (drawer: HTMLElement) => {
        drawer.style.animation = "twink 1.5s 1";
        drawer.style.filter = "drop-shadow(4px 7px 2px rgba(0, 0, 0, 0.5))";
    },

    defaultHighlight: (element: HTMLElement) => {
        element.style.animation = "inherit";
        element.style.filter = "brightness(0.5)";
    },

    scrollTo: (element: HTMLElement) => {
        element.scrollIntoView({ inline: "center" });
    },

    /* código */
    getCode: () => {
        return getDoc();
    },
    
    setCode: (text: string) => {
        setDoc(text);
    },

    viewElement: (element: HTMLElement, set: boolean) => {
        if(set) globals.displayElement(element);
        else globals.undisplayElement(element);
    },
    
    /* mostrar ou ocultar elemento */
    displayElement: (element: HTMLElement) => {
        element.style.display = 'inherit';
    },

    undisplayElement: (element: HTMLElement) => {
        element.style.display = "none";
    },

    /* monitora comportamento do menu */
    monitoreMenu: (size: number) => {
        if (window.innerWidth > size) {
            globals.viewMenu(true);
            globals.undisplayElement(globals.menuburger);
        }
        else {
            globals.viewMenu(false);
            globals.displayElement(globals.menuburger);
        }
    },

    viewMenu: (set: boolean) => {
        if(set) {
            globals.menumodal.style.opacity = '1';
            globals.menumodal.style.visibility = "visible";
        }
        else {
            globals.menumodal.style.opacity = '0';
            globals.menumodal.style.visibility = "hidden";
        }
    }
}
// ------------------------------------------------------------------------------- 