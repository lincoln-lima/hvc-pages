import { globals } from "./global";
import ahv from "./ahv";
import drawers from "./drawers";
import { HVC } from "hvcjs";

drawers();
ahv();

const hvc = new HVC();

/* eventos para executar código */
globals.run.addEventListener('click', function () {
    exec(true);
});

globals.debug.addEventListener('click', function () {
    exec(false);
})

document.addEventListener('keydown', e => {
    let key = e.key.toLocaleLowerCase();

    if (key === "f9") exec(true);
    else if (key === "f8") exec(false);
});

async function exec(isquick: boolean) {
    preparaExecucao();

    try {
        if (isquick) await hvc.run();
        else await hvc.debug(+globals.delay);
    }
    catch (e) {
        console.log((e as Error).message);
    }
}

function preparaExecucao() {
    hvc.setCode(globals.getCode());

    globals.saida.innerText = '-';
    globals.epi.innerText = '-';
}
// ------------------------------------------------------------------------------- 
globals.salvar.addEventListener('click', function () {
    globals.delay = (document.getElementById("delay")! as HTMLInputElement).value;
});
// ------------------------------------------------------------------------------- 
/* evento de saída do HVC */
hvc.addEventOutput((out: string) => {
    globals.saida.innerText = out;
});

/* evento de cada ciclo clock */
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