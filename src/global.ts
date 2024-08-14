import { getDoc, setDoc } from "./codemirror"

export const globals = {
    /* áreas da página */
    menumodal: document.getElementsByTagName("menu")[0]!,
    configmodal: document.getElementById("config-modal")!,
    cardmodal: document.getElementById("card-modal")!,

    /* áreas de texto */
    saida: document.getElementById("saida-span")!,
    acumulador: document.getElementById("acumulador-span-valor")!,
    epi: document.getElementById("epi-span")!,
    card: document.getElementById("cartao")! as HTMLInputElement,

    /* botões da página - ações de clique */
    menuburger: document.getElementsByClassName("botao-menu")[0]! as HTMLElement,

    run: document.getElementById("run")!,
    debug: document.getElementById("debug")!,
    import: document.getElementById("import")!,
    export: document.getElementById("export")!,

    configs: document.getElementById("config")!,
    saveconfigs: document.getElementById("save-configs")!,
    closeconfigs: document.getElementById("close-configs")!,

    submitcard: document.getElementById("submit-card")!,

    /* armazena gavetas */
    gaveteiro: document.getElementById("gaveteiro")!,
    numgavs: 100,

    /* área de configuração */
    delay: document.getElementById("delay")! as HTMLInputElement,

    /* código */
    getCode: () => {
        return getDoc();
    },
    
    setCode: (text: string) => {
        setDoc(text);
    },
    
    /* mostrar ou ocultar elemento */
    displayElement: (element: HTMLElement) => {
        element.style.display = "block";
    },

    undisplayElement: (element: HTMLElement) => {
        element.style.display = "none";
    },

    monitoreMenu: (size: number) => {
        if (window.innerWidth > size) {
            globals.menumodal.style.opacity = '1';
            globals.menumodal.style.visibility = "visible";

            globals.menuburger.style.display = "none";
        }
        else {
            globals.menumodal.style.opacity = '0';
            globals.menumodal.style.visibility = "hidden";

            globals.menuburger.style.display = "block";
        }

    }
}
// ------------------------------------------------------------------------------- 