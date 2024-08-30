import { globals } from "./global";
import { HVC } from "hvcjs";
import ahv from "./ahv";
// ------------------------------------------------------------------------------- 
const hvc = new HVC();

ahv();
// ------------------------------------------------------------------------------- 
globals.run.addEventListener('click', () => exec(true));
globals.debug.addEventListener('click', () => exec(false));

document.addEventListener('keydown', e => {
    let key = e.key.toLocaleLowerCase();

    if (key === "f9") exec(true);
    else if (key === "f8") exec(false);
});

async function exec(isquick: boolean) {
    hvc.setCode(globals.getCode());

    globals.saida.innerText = '-';
    globals.epi.innerText = '-';

    try {
        if (isquick) await hvc.run();
        else await hvc.debug(+globals.delay.value);
    }
    catch (e) {
        console.log((e as Error).message);
    }
}
// ------------------------------------------------------------------------------- 
globals.saveconfigs.addEventListener('click', () => {
    localStorage.setItem("delay", globals.delay.value);

    globals.undisplayElement(globals.configmodal);

    alert("As configurações foram salvas!");
});
// ------------------------------------------------------------------------------- 
hvc.addEventOutput((out: string) => {
    globals.saida.innerText = out;
});

hvc.addEventInput(async () => {
    globals.displayElement(globals.cardmodal, 'flex');

    globals.card.value = '';
    globals.card.focus();

    return await new Promise<string>(resolve => {
        const submit = () => {
            globals.undisplayElement(globals.cardmodal);

            setTimeout(resolve, +localStorage.getItem("delay")!, globals.card.value);
        }

        globals.submitcard.onclick = () => submit();

        globals.card.onkeydown = e => {
            if (e.key.toLowerCase() === "enter") {
                e.preventDefault();

                submit();
            }
        };
    });
});
// ------------------------------------------------------------------------------- 
hvc.addEventClock(_HVMState => {
    const hvm = hvc.getHVM();

    const acumulador = hvm.calculadora.getAcumulador();
    const drawers = hvm.gaveteiro.getGavetas();
    const epi = hvm.epi.lerRegistro();

    const gaveta = globals.getGaveta(epi);

    console.log(hvm.portaCartoes.conteudo); //inserir tabela no lugar do editor pegando o porta-cartoes

    globals.acumulador.innerText = acumulador.toString().padStart(3, "0");

    gaveta.scrollIntoView({ inline: "center" });
    gaveta.style.filter = "hue-rotate(45deg)";
    gaveta.focus();

    globals.epi.innerText = epi.toString();

    Array.from(globals.contentgavetas).forEach((cont, i) => {
        (cont as HTMLElement).innerText = drawers[i] ? drawers[i].toString() : "---";
    })
});