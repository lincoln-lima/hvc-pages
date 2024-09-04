import { globals } from "./global";
import { HVC } from "hvcjs";
import ahv from "./ahv";
// ------------------------------------------------------------------------------- 
ahv();
// ------------------------------------------------------------------------------- 
const hvc = new HVC();
// ------------------------------------------------------------------------------- 
globals.run.addEventListener('click', () => exec(true));
globals.debug.addEventListener('click', () => exec(false));

document.addEventListener('keydown', e => {
    let key = e.key.toLocaleLowerCase();

    if (key === "f9") exec(true);
    else if (key === "f8") exec(false);
});
// ------------------------------------------------------------------------------- 
const exec = async(isquick: boolean) => {
    Array.from(globals.gavetas).forEach(gaveta => {
        globals.defaultHighlight(gaveta as HTMLElement);
    })

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
    globals.displayElement(globals.cardmodal);

    globals.card.value = '';
    globals.card.focus();

    return await new Promise<string>(resolve => {
        const submit = () => {
            globals.undisplayElement(globals.cardmodal);

            setTimeout(resolve, +globals.delay.value, globals.card.value);
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
    // const state = hvm.getState();

    const acumulador = hvm.calculadora.getAcumulador();
    const drawers = hvm.gaveteiro.getGavetas();
    const epi = hvm.epi.lerRegistro();
    
    // console.log(hvm.portaCartoes.conteudo); //inserir tabela no lugar do editor pegando o porta-cartoes
    
    globals.acumulador.innerText = acumulador >= 0 ? acumulador.toString().padStart(3, "0") : acumulador.toString().padStart(3, " ");
    globals.epi.innerText = epi.toString();

    (globals.gavetas[epi] as HTMLElement).style.filter = "hue-rotate(45deg)";
    globals.scrollTo(globals.gavetas[epi] as HTMLElement);
    
    Array.from(globals.contentgavetas).forEach((cont, i) => {
        const gaveta = globals.gavetas[i] as HTMLElement;

        if(drawers[i]) {
            // console.log(i);
            globals.highlightDrawer(gaveta);

            (cont as HTMLElement).innerText = drawers[i].toString();
        }
        else (cont as HTMLElement).innerText = "---";
        // (cont as HTMLElement).innerText = drawers[i] ? drawers[i].toString() : "---";
    })
});