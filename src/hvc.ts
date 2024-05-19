import { HVC, HVM, HVMState } from "hvcjs"

const hvc = new HVC();

/* evento de click para executar código */
const executar = document.getElementById("run")!;
executar.addEventListener('click', () => {
    /* recuperando código da área de texto */
    var codigo = document.getElementById("area-texto")!;
    hvc.setCode(codigo.value);

    hvc.debug(100);
});

/* evento de saída */
hvc.addEventOutput((out:string) => {
    var saida = document.getElementById("saida")!;
    
    saida.innerText = out;
    // console.log(out);
})

hvc.addEventClock((HVM:HVMState) => {
    const hvm = hvc.getHVM();

    console.log(hvm.calculadora.getAcumulador());
    console.log(hvm.epi.lerRegistro());
})