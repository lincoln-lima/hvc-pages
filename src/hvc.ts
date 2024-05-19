import { HVC } from "hvcjs"

const hvc = new HVC();

/* seções da página */

// áreas de texto
const saida = document.getElementById("saida")!;
const acumulador = document.getElementById("acumulador")!;
const epi = document.getElementById("epi")!;

/* 
// seções com itens
const gaveteiro = document.getElementById("secs-gaveteiro")!;
*/

/* botões da página - ações de clique */
const executar = document.getElementById("run")!;

function rodarCodigo() {
    /* recuperando código da área de texto */
    let codigo = document.getElementById("area-texto")!;
    hvc.setCode(codigo.innerHTML);

    hvc.debug(700);
}

/* evento de click para executar código */
executar.addEventListener('click', () => {
    rodarCodigo();
});

/* evento de atalho */
document.addEventListener('keydown', e => {
    if(e.key.toLocaleLowerCase() === "f9") rodarCodigo();
    // console.log(e);
})

/* evento de saída do HVC */
hvc.addEventOutput((out:string) => {
    saida.innerText = out;
    // console.log(out);
})

hvc.addEventClock(HVMState => {
    const hvm = hvc.getHVM();

    const val_acumulador = hvm.calculadora.getAcumulador().toString();
    const val_epi = hvm.epi.lerRegistro().toString();
    const val_gaveta = hvm.gaveteiro.getGavetas();

    acumulador.innerText = val_acumulador;
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
})