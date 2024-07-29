import {EditorState} from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";
import {defaultKeymap} from "@codemirror/commands";
import { noctisLilac } from "thememirror";
import { HVC } from "hvcjs";

const hvc = new HVC();

/* áreas de texto */
const editor = document.getElementById("editor-area")!;
const saida = document.getElementById("saida-span")!;
const acumulador = document.getElementById("acumulador-span-valor")!;
const epi = document.getElementById("epi-span")!;

/* botões da página - ações de clique */
const executar = document.getElementById("run")!;
// const export = document.getElementById("exp-imp")!;
const salvar = document.getElementById("save")!;

/* campos de configuração */
let delay = document.getElementById("delay")!.value;

/* evento de click para executar código */
executar.addEventListener('click', rodarCodigo);

salvar.addEventListener('click', salvarConfigs);

/* evento de atalho */
document.addEventListener('keydown', e => {
    if(e.key.toLocaleLowerCase() === "f9") rodarCodigo();
    // console.log(e);
});

function rodarCodigo() {
    saida.innerText = '-';
    epi.innerText = '-';

    /* recuperando código da área de texto */
    // let codigo = document.getElementById("area-texto")!.innerHTML;

    console.log(state.doc.toString());
    let codigo = state.doc.toString();
    hvc.setCode(codigo);

    hvc.debug(delay);
}

function salvarConfigs() {
    delay = document.getElementById("delay")!.value;
    // console.log(delay);
}

/* evento de saída do HVC */
hvc.addEventOutput((out:string) => {
    saida.innerText = out;
    // console.log(out);
});

hvc.addEventClock(HVMState => {
    const hvm = hvc.getHVM();

    let val_acumulador = hvm.calculadora.getAcumulador().toString();
    const val_epi = hvm.epi.lerRegistro().toString();
    const val_gaveta = hvm.gaveteiro.getGavetas();

    let aux;
    switch(val_acumulador.length) {
        case 1:
            aux = '00';
            break
        case 2:
            aux = '0';
            break
        case 3:
            aux = '';
            break
    }

    acumulador.innerText = aux + val_acumulador;

    epi.innerText = val_epi;

    for(let i = 0; i < 100; i++) {
        let cont_gaveta = document.getElementById("cont-gaveta-"+i)!;
        
        cont_gaveta.innerText = val_gaveta[i] ? val_gaveta[i].toString() : "---";
        // let cont_gaveta = gavetas[i].getElementsByClassName("cont-gaveta");
        // console.log(cont_gaveta);
    }

    // console.log("-------------");
    
    // console.log(val_gaveta);
    // console.log("Acumulador: " + val_acumulador);
    // console.log("EPI: " + val_epi);
});

let state = EditorState.create({
    doc: "750\n751\n050\n251\n160\n860\n000\n20\n35",
    extensions: [
        keymap.of(defaultKeymap),
        noctisLilac 
    ]
});
  
let view = new EditorView({
    state: state,
    parent: editor
});