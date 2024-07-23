import { HVC } from "hvcjs"

const hvc = new HVC();

/* áreas de texto */
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
    let codigo = document.getElementById("area-texto")!;
    hvc.setCode(codigo.innerHTML);

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