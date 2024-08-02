import { globals } from "./global";
import { HVC } from "hvcjs";
import { view } from "./codemirror";

const hvc = new HVC();

/* eventos para executar código */
globals.run.addEventListener('click', function(){
    exec(true);
});

/* globals.debug.addEventListener('click', function(){
    exec(true);
}) */

document.addEventListener('keydown', e => {
    let key = e.key.toLocaleLowerCase();

    if(key === "f9") exec(true);
    else if(key === "f8") exec(false);
});

async function exec(quick:boolean) {
    preparaExecucao();

    try {
        if (quick) await hvc.run();
        else await hvc.debug(+globals.delay);
    }
    catch (e) {
        console.log((e as Error).message);
    }
}

function preparaExecucao() {
    hvc.setCode(view.state.doc.toString());

    globals.saida.innerText = '-';
    globals.epi.innerText = '-';
}
// ------------------------------------------------------------------------------- 
globals.salvar.addEventListener('click', function() {
    globals.delay = (document.getElementById("delay")! as HTMLInputElement).value;
});
// ------------------------------------------------------------------------------- 
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