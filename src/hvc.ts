import { HVC } from "hvcjs";
import { globals } from "./default";
import { play } from "./playground";
// ------------------------------------------------------------------------------- 
import ahv from "./ahv";
// ------------------------------------------------------------------------------- 
export default () => {
    const hvc = new HVC();
    ahv();
    // ---------------------------------------------------------------------------
    play.elements.run().addEventListener('click', () => exec(true));
    play.elements.debug().addEventListener('click', () => exec(false));

    document.addEventListener('keydown', e => {
        const key = e.key.toLocaleLowerCase();

        if (key === "f9") exec(true);
        else if (key === "f8") exec(false);
    });
    // ---------------------------------------------------------------------------
    const exec = async(isquick: boolean) => {
        Array.from(play.elements.gavetas()).forEach(gaveta => {
            play.actions.highlightDrawer(gaveta as HTMLElement, 'default');
        })

        hvc.setCode(play.actions.getCode());

        play.elements.saida().innerText = '-';
        play.elements.epi().innerText = '-';

        try {
            if (isquick) await hvc.run();
            else await hvc.debug(+play.elements.delay().value);
        }
        catch (e) {
            hvc.finish();
            play.actions.setState(hvc.getHVM().getState().toLowerCase());
            
            play.actions.detectError((e as Error).message);
        }
    }
    // ---------------------------------------------------------------------------
    play.elements.saveconfigs().addEventListener('click', () => {
        localStorage.setItem("delay", play.elements.delay().value);

        globals.actions.showElement(play.elements.configmodal(), false);

        alert("As configurações foram salvas!");
    });
    // ------------------------------------------------------------------------------- 
    hvc.addEventOutput((out: string) => {
        play.elements.saida().innerText = out;
    });

    hvc.addEventInput(async () => {
        globals.actions.showElement(play.elements.cardmodal(), true);

        play.elements.card().value = '';
        play.elements.card().focus();

        return await new Promise<string>(resolve => {
            const submit = () => {
                globals.actions.showElement(play.elements.cardmodal(), false);
                setTimeout(resolve, +play.elements.delay().value, play.elements.card().value);
            }

            play.elements.submitcard().onclick = () => submit();

            play.elements.card().onkeydown = (e: KeyboardEvent) => {
                if (e.key.toLowerCase() === "enter") {
                    e.preventDefault();

                    submit();
                }
            };
        });
    });
    // ------------------------------------------------------------------------------- 
    hvc.addEventClock(HVMState => {
        const hvm = hvc.getHVM();

        const acumulador = hvm.calculadora.getAcumulador();
        const drawers = hvm.gaveteiro.getGavetas();
        const epi = hvm.epi.lerRegistro();

        const pointed = play.elements.gavetas()[epi] as HTMLElement;
        
        // console.log(hvm.portaCartoes.conteudo); //inserir tabela no lugar do editor pegando o porta-cartoes

        play.actions.setState(HVMState.toLowerCase());
        
        play.elements.acumulador().innerText = acumulador >= 0 ? acumulador.toString().padStart(3, "0") : '-' + (acumulador * -1).toString().padStart(2, "0");
        play.elements.epi().innerText = epi.toString();
        
        Array.from(play.elements.contentgavetas()).forEach((cont, i) => {
            const gaveta = play.elements.gavetas()[i] as HTMLElement;

            if(drawers[i]) {
                play.actions.highlightDrawer(gaveta, 'highlight');

                (cont as HTMLElement).innerText = drawers[i].toString();
            }
            else (cont as HTMLElement).innerText = "---";
        });

        play.actions.highlightDrawer(pointed, 'pointed');
        globals.actions.scrollTo(pointed);
    });
}