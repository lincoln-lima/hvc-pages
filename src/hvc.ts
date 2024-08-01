import { globals } from "./global";
import { HVC } from "hvcjs";
import { view } from "./codemirror";

const hvc = new HVC();

let codigo;

/* campos de configuração */
let delay = document.getElementById("delay")!.value;

/* evento de click para executar código */
globals.executar.addEventListener('click', rodarCodigo);

globals.salvar.addEventListener('click', salvarConfigs);

/* evento de atalho */
document.addEventListener('keydown', e => {
    if (e.key.toLocaleLowerCase() === "f9") rodarCodigo();
});

async function rodarCodigo() {
    globals.saida.innerText = '-';
    globals.epi.innerText = '-';

    codigo = view.state.doc.toString();

    hvc.setCode(codigo);

    try {
        await hvc.run();
    }
    catch(e) {
        console.log((e as Error).message);
    }
}

function salvarConfigs() {
    delay = document.getElementById("delay")!.value;
    // console.log(delay.innerText);
    // console.log(delay);
}

/* evento de saída do HVC */
hvc.addEventOutput((out: string) => {
    globals.saida.innerText = out;
});

hvc.addEventClock(_HVMState => {
    const hvm = hvc.getHVM();

    let val_acumulador = hvm.calculadora.getAcumulador().toString();
    const val_epi = hvm.epi.lerRegistro().toString();
    const val_gaveta = hvm.gaveteiro.getGavetas();

    let aux;
    switch (val_acumulador.length) {
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

    globals.acumulador.innerText = aux + val_acumulador;

    globals.epi.innerText = val_epi;

    for (let i = 0; i < 100; i++) {
        let cont_gaveta = document.getElementById("cont-gaveta-" + i)!;

        cont_gaveta.innerText = val_gaveta[i] ? val_gaveta[i].toString() : "---";
    }
});