import { HVC } from "hvcjs";
import { globals } from "../default";
import { play } from "../playground";
// -----------------------------------------------------------------------------------
import ahv from "./ahv";
// -----------------------------------------------------------------------------------
export default () => {
    const hvc = new HVC();
    let previous = "desligado";
    // ------------------------------------------------------------------------------- 
    ahv();
    // ------------------------------------------------------------------------------- 
    const runner = play.elements.run();
    const debug = play.elements.debug();
    
    const back = play.elements.back();
    const finish = play.elements.finish();
    const pausecontinue = play.elements.pausecontinue();
    const forth = play.elements.forth();
    
    const outwrite = play.elements.out();
    const epiwrite = play.elements.epi();
    const acumulator = play.elements.acumulator();
    
    const drawers = play.elements.drawers();
    const drawerscontent = play.elements.drawerscontent();
    
    const delay = play.elements.delay();
    
    const debugmenu = play.elements.debugmenu();
    const editor = play.elements.editor();
    const scrolltablecards = play.elements.scrolltablecards();
    
    const cards = play.elements.cards();
    const readcard = play.elements.readcard();
    const cardmodal = play.elements.cardmodal();
    const ratingmodal = play.elements.ratingmodal();
    const submitcard = play.elements.submitcard();
    // ------------------------------------------------------------------------------- 
    runner.addEventListener('click', () => exec(true));
    debug.addEventListener('click', () => exec(false));

    document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();

        if (key === "f9") exec(true);
        else if (key === "f8") exec(false);
    });
    // ------------------------------------------------------------------------------- 
    const exec = async(isquick: boolean) => {
        Array.from(drawers).forEach(gaveta => {
            play.actions.highlightDrawer(gaveta as HTMLElement, 'default');
        });
        // ---------------------------------------------------------------------------
        terminate();
        // ---------------------------------------------------------------------------
        hvc.setCode(play.actions.getCode());

        outwrite.innerText = '-';
        epiwrite.innerText = '-';
        // ---------------------------------------------------------------------------
        try {
            if (isquick) await hvc.run();
            else {
                globals.actions.switchVisibility(debugmenu, true);

                globals.actions.undisplayElement(editor);
                globals.actions.displayElement(scrolltablecards);

                globals.actions.undisplayElement(play.elements.help());

                await hvc.debug(+delay.value);
            }
        }
        catch (e) {
            detectError(e as Error);
        }
        finally {
            if(localStorage.getItem("askrating") === "true") {
                const counter = +play.elements.counter() + 1;
                localStorage.setItem("counter", counter.toString());

                if(counter % 3 == 0) globals.actions.displayElement(ratingmodal);
            }
        }
    }

    const detectError = (e: Error) => {
        terminate();
        
        play.actions.showError(e.message);
    }
    
    // ------------------------------------------------------------------------------- 
    hvc.addEventOutput((out: string) => {
        outwrite.innerText = out;
    });

    hvc.addEventInput(async () => {
        globals.actions.displayElement(cardmodal);

        readcard.value = '';
        readcard.focus();

        return await new Promise<string>(resolve => {
            const submit = () => {
                globals.actions.undisplayElement(cardmodal);
                setTimeout(resolve, +delay.value, readcard.value);
            }

            submitcard.onclick = () => submit();

            readcard.onkeydown = (e: KeyboardEvent) => {
                if (e.key.toLowerCase() === "enter") {
                    e.preventDefault();
                    submit();
                }
            };
        });
    });
    // ------------------------------------------------------------------------------- 
    const updateViewers = () => {
        const hvm = hvc.getHVM();
        // ---------------------------------------------------------------------------
        const portaCartoes = hvm.portaCartoes.conteudo;
        const acumulador = hvm.calculadora.getAcumulador();
        const gavetas = hvm.gaveteiro.getGavetas();
        const epi = hvm.epi.lerRegistro();
        // ---------------------------------------------------------------------------
        const pointed = drawers[epi] as HTMLElement;
        const endindex = gavetas.indexOf('000');
        // ---------------------------------------------------------------------------
        cards.innerHTML = "";

        portaCartoes.forEach(cartao => {
            play.actions.addCardToTable(cartao);
        });
        // ---------------------------------------------------------------------------
        play.actions.setState(hvm.getState().toLowerCase());
        // console.log(hvm.getState());
        // ---------------------------------------------------------------------------
        acumulator.innerText = acumulador >= 0 ? acumulador.toString().padStart(3, "0") : '-' + (acumulador * -1).toString().padStart(2, "0");
        epiwrite.innerText = epi.toString();
        // ---------------------------------------------------------------------------
        Array.from(drawerscontent).forEach((cont, i) => {
            const drawer = drawers[i] as HTMLElement;
            let style;

            if(gavetas[i]) {
                style = (endindex == -1 || i <= endindex) ? 'code' : 'data';
                
                play.actions.highlightDrawer(drawer, style);

                (cont as HTMLElement).innerText = gavetas[i];
            }
            else (cont as HTMLElement).innerText = "---";
        });
        // ---------------------------------------------------------------------------
        play.actions.highlightDrawer(pointed, 'pointed');
        globals.actions.scrollTo(pointed);
    }
    // ---------------------------------------------------------------------------
    hvc.addEventClock(HVMState => {
        const state = HVMState.toLowerCase();

        updateViewers();

        if(previous != state && state === "desligado") terminate();
        previous = state;
    });
    // ---------------------------------------------------------------------------
    const terminate = () => {
        globals.actions.switchVisibility(debugmenu, false);
        globals.actions.undisplayElement(scrolltablecards);
        globals.actions.undisplayElement(cardmodal);
        globals.actions.displayElement(editor);
        globals.actions.displayElement(play.elements.help());
        
        hvc.finish();
        hvc.continue();

        pausecontinue.className = "pause";
        
        previous = "desligado";
        play.actions.setState(previous);
    };
    
    const controlling = async (set: boolean) => {
        pausecontinue.className = "continue";

        if(set) {
            await hvc.back();
            updateViewers();
            globals.actions.undisplayElement(cardmodal);
        }
        else {
            try {
                await hvc.next();
            }
            catch (e) {
                detectError(e as Error);
            }
        }
    };
    // ---------------------------------------------------------------------------
    pausecontinue.addEventListener('click', () => {
        if(pausecontinue.className === 'pause') hvc.stop();
        else hvc.continue();

        play.actions.switchPauseContinue();
    });

    finish.addEventListener('click', terminate);

    back.addEventListener('click', () => controlling(true));
    forth.addEventListener('click', () => controlling(false));
    // ---------------------------------------------------------------------------
    document.addEventListener('keydown', e => {
        const hvmstate = hvc.getHVM().getState().toLowerCase();

        if (e.ctrlKey) {
            const key = e.key.toLowerCase();

            if(key === 'c' && hvmstate != 'desligado') {
                e.preventDefault();
                terminate();
            }
            else if(key === 'arrowleft' && hvmstate === 'execução') {
                e.preventDefault();
                controlling(true);
            }
            else if (key === 'arrowright' && (hvmstate === 'execução' || hvmstate === 'carga')) {
                e.preventDefault();
                controlling(false);
            }
        }
    });
}