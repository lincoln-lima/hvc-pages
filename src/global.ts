import { getDoc, setDoc } from "./codemirror"

export const globals = {
    /* elementos da página */
    menu: document.getElementById("menu")!,
    botao_menu: document.getElementsByClassName("botao-menu")[0]! as HTMLElement,

    /* áreas de texto */
    saida: document.getElementById("saida-span")!,
    acumulador: document.getElementById("acumulador-span-valor")!,
    epi: document.getElementById("epi-span")!,
    // editor: document.getElementById("porta-cartoes")!,

    /* botões da página - ações de clique */
    run: document.getElementById("run")!,
    debug: document.getElementById("debug")!,
    import: document.getElementById("import")!,
    export: document.getElementById("export")!,
    salvar: document.getElementById("save")!,

    /* armazena gavetas */
    gaveteiro: document.getElementById("gaveteiro")!,
    numgavs: 100,

    /* área de configuração */
    delay: (document.getElementById("delay")! as HTMLInputElement)!.value,

    /* código */
    getCode: () => {
        return getDoc();
    },
    
    setCode: (text: string) => {
        setDoc(text);
    }
}