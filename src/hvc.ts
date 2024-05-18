import { HVC } from "hvcjs"

const hvc = new HVC();

/* evento de click para executar código */
const executar = document.getElementById("run");
executar.addEventListener('click', () => {
    /* recuperando código da área de texto */
    var codigo = document.getElementById("area-texto");
    hvc.setCode(codigo.value);

    hvc.run();
});

/* evento de saída */
hvc.addEventOutput((out:string) => {
    var saida = document.getElementById("saida");
    
    saida.innerText = out;
    // console.log(out);
})
