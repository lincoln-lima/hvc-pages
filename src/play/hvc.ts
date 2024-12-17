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
    const tablecards = play.elements.tablecards();
    
    const cards = play.elements.cards();
    const readcard = play.elements.readcard();
    const cardmodal = play.elements.cardmodal();
    const ratingmodal = play.elements.ratingmodal();
    const formcard = play.elements.formcard();
    // ------------------------------------------------------------------------------- 
    const exec = async(set: boolean) => {
        await terminate();
        // ---------------------------------------------------------------------------
        Array.from(drawers).forEach(gaveta => {
            play.actions.highlightDrawer(gaveta as HTMLElement, 'default');
        });
        // ---------------------------------------------------------------------------
        hvc.setCode(play.actions.getCode());

        outwrite.innerText = '-';
        epiwrite.innerText = '-';
        // ---------------------------------------------------------------------------
        try {
            if (set) await hvc.run();
            else {
                globals.actions.switchVisibility(debugmenu, true);

                globals.actions.undisplayElement(editor);
                globals.actions.displayElement(tablecards);

                globals.actions.undisplayElement(play.elements.help());

                await hvc.debug(+delay.value);
            }
        }
        catch (e) {
            await detectError(e as Error);
        }
        finally {
            if(localStorage.getItem("askrating") === "true") {
                const counter = +play.elements.counter() + 1;
                localStorage.setItem("counter", counter.toString());

                if(counter % 3 == 0) globals.actions.displayElement(ratingmodal);
            }
        }
    }

    const detectError = async(e: Error) => {
        await terminate();
        play.actions.showError(e.message);
    }

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

    const terminate = async() => {
        globals.actions.switchVisibility(debugmenu, false);
        globals.actions.undisplayElement(tablecards);
        globals.actions.undisplayElement(cardmodal);
        globals.actions.displayElement(editor);
        globals.actions.displayElement(play.elements.help());
        
        hvc.finish();
        await hvc.continue();

        pausecontinue.className = "pause";
        
        previous = "desligado";
        play.actions.setState(previous);
    };
    
    const controlling = async(set: boolean) => {
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
                await detectError(e as Error);
            }
        }
    };
    // ------------------------------------------------------------------------------- 
    hvc.addEventOutput((out: string) => {
        outwrite.innerText = out;
    });

    hvc.addEventInput(async () => {
        globals.actions.displayElement(cardmodal);

        readcard.value = '';
        readcard.focus();

        return new Promise(resolve => {
            const submit = () => {
                globals.actions.undisplayElement(cardmodal);
                setTimeout(resolve, +delay.value, readcard.value);
            }
            
            formcard.onsubmit = e => {
                e.preventDefault();
                submit();
            }
        });
    });
    
    hvc.addEventClock(async HVMState => {
        const state = HVMState.toLowerCase();

        updateViewers();

        if(previous != state && state === "desligado") await terminate();
        previous = state;
    });
    // ---------------------------------------------------------------------------
    runner.addEventListener('click', async() => await exec(true));
    debug.addEventListener('click', async() => await exec(false));

    pausecontinue.addEventListener('click', async() => {
        const topause = pausecontinue.className === 'pause';

        play.actions.switchPauseContinue();

        if(topause) await hvc.stop();
        else {
            try {
                await hvc.continue();
            }
            catch (e) {
                await detectError(e as Error);
            }
        }
    });

    back.addEventListener('click', async() => await controlling(true));
    forth.addEventListener('click', async() => await controlling(false));

    finish.addEventListener('click', async() => await terminate());
    // ---------------------------------------------------------------------------
    document.addEventListener('keydown', async(e) => {
        const key = e.key.toLowerCase();
        const hvmstate = hvc.getHVM().getState().toLowerCase();

        if (e.ctrlKey) {
            if(key === 'c' && hvmstate != 'desligado') {
                e.preventDefault();
                await terminate();
            }
            else if(key === 'arrowleft' && hvmstate === 'execução') {
                e.preventDefault();
                await controlling(true);
            }
            else if (key === 'arrowright' && (hvmstate === 'execução' || hvmstate === 'carga')) {
                e.preventDefault();
                await controlling(false);
            }
        }
        else {
            if (key === "f9") await exec(true);
            else if (key === "f8") await exec(false);
        }
    });
}