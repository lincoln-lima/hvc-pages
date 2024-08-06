import { getDoc, setDoc } from "./codemirror"

export const globals = {
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

    /* área de configuração */
    delay: (document.getElementById("delay")! as HTMLInputElement).value,

    /* código */
    getCode: () => {
        return getDoc();
    },
    
    setCode: (text: string) => {
        setDoc(text);
    }
}