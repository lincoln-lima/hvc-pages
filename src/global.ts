export const globals = {
    /* áreas de texto */
    saida: document.getElementById("saida-span")!,
    acumulador: document.getElementById("acumulador-span-valor")!,
    epi: document.getElementById("epi-span")!,
    editor: document.getElementById("porta-cartoes")!,

    /* botões da página - ações de clique */
    // execs: document.getElementsByClassName("exec"),
    run: document.getElementById("run")!,
    // debug: document.getElementById("debug")!,
    // export: document.getElementById("exp-imp")!,
    salvar: document.getElementById("save")!,

    /* área de configurações */
    delay: (document.getElementById("delay")! as HTMLInputElement).value
}