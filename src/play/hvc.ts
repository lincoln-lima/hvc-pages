import { HVC, HVMState } from "hvcjs";
import { play } from "../playground";
import { globals } from "../default";
// -----------------------------------------------------------------------------------
import ahv from "./ahv";
// -----------------------------------------------------------------------------------
export default () => {
    ahv();
    // ------------------------------------------------------------------------------- 
    const hvc = new HVC();
    // ------------------------------------------------------------------------------- 
    const runner = play.elements.run();
    const debug = play.elements.debug();
    
    const back = play.elements.back();
    const forth = play.elements.forth();
    const finish = play.elements.finish();
    const pausecontinue = play.elements.pausecontinue();
    
    const outwrite = play.elements.out();
    const epiwrite = play.elements.epi();
    const acumulator = play.elements.acumulator();
    
    const drawers = play.elements.drawers();
    const drawerscontent = play.elements.drawerscontent();
    
    const skip = play.elements.skip();
    const delay = play.elements.delay();
    const paused = play.elements.paused();
    
    const editor = play.elements.editor();
    const debugmenu = play.elements.debugmenu();

    const cards = play.elements.cards();
    const tablecards = play.elements.tablecards();
    
    const readcard = play.elements.readcard();
    const formcard = play.elements.formcard();
    const cardmodal = play.elements.cardmodal();
    const ratingmodal = play.elements.ratingmodal();
    // ------------------------------------------------------------------------------- 
    let previous : HVMState = "DESLIGADO";
    // ------------------------------------------------------------------------------- 
    const exec = async(set: boolean) => {
        await terminate();
        // ---------------------------------------------------------------------------
        play.actions.hideModals();
        globals.actions.undisplayElement(play.elements.help());
        // ---------------------------------------------------------------------------
        Array.from(drawers).forEach(gaveta => play.actions.highlightDrawer(gaveta, "default"));

        globals.actions.changeElementText(outwrite, "");
        // ---------------------------------------------------------------------------
        hvc.setCode(play.actions.getCode());
        // ---------------------------------------------------------------------------
        try {
            if(set) await hvc.run();
            else {
                globals.actions.undisplayElement(editor);
                globals.actions.displayElement(tablecards);
                globals.actions.switchVisibility(debugmenu, true);

                await hvc.debug(+delay.value, !skip.checked, paused.checked ? "PAUSADO" : "RODANDO");
            }
        }
        catch (e) {
            await detectError(e as Error);
        }
        finally {
            if(localStorage.getItem("askrating") === "true") {
                const counter = +play.elements.counter() + 1;
                globals.actions.changeStorage("counter", counter.toString());

                if(counter % 3 == 0) globals.actions.displayElement(ratingmodal);
            }
        }
    }

    const detectError = async(e: Error) => {
        await terminate();
        play.actions.showError(e.message);
    }

    const updateViewers = (state: HVMState) => {
        const hvm = hvc.getHVM();
        // ---------------------------------------------------------------------------
        const epi = hvm.epi.lerRegistro();
        const gavetas = hvm.gaveteiro.getGavetas();
        const portaCartoes = hvm.portaCartoes.conteudo;
        const acumulador = hvm.calculadora.getAcumulador();
        // ---------------------------------------------------------------------------
        const pointed = drawers[epi];
        const endindex = gavetas.indexOf("000");
        // ---------------------------------------------------------------------------
        play.actions.setState(state);
        // ---------------------------------------------------------------------------
        cards.innerHTML = "";

        portaCartoes.forEach(cartao => play.actions.addCardToTable(cartao));
        // ---------------------------------------------------------------------------
        globals.actions.changeElementText(epiwrite, epi.toString());
        globals.actions.changeElementText(acumulator, acumulador >= 0 ? acumulador.toString().padStart(3, "0") : "-" + (acumulador * -1).toString().padStart(2, "0"));
        // ---------------------------------------------------------------------------
        play.actions.highlightDrawer(pointed, "pointed");
        if(state != "CARGA") globals.actions.scrollTo(pointed);
        // ---------------------------------------------------------------------------
        Array.from(drawerscontent).forEach((cont, i) => {
            const drawer = drawers[i];
            let content;

            if(gavetas[i]) {
                content = gavetas[i];

                if(epi != i) {
                    const style = (endindex == -1 || i <= endindex) ? "code" : "data";
                    play.actions.highlightDrawer(drawer, style);
                }
            }
            else content = "---";

            globals.actions.changeElementText(cont, content);
        });
    }

    const terminate = async() => {
        hvc.finish();
        
        previous = "DESLIGADO";
        play.actions.setState(previous);
        
        play.actions.switchPauseContinue(paused.checked);

        globals.actions.displayElement(editor);
        globals.actions.displayElement(play.elements.help());

        globals.actions.undisplayElement(cardmodal);
        globals.actions.undisplayElement(tablecards);

        globals.actions.switchVisibility(debugmenu, false);
    }
    
    const toggling = async() => {
        const hvm = hvc.getHVM();
        const hvmstate = hvm.getState();

        if(hvmstate != "DESLIGADO") {
            const topause = pausecontinue.classList.contains("pause");

            play.actions.switchPauseContinue(topause);

            if(topause) await hvc.stop();
            else {
                try {
                    await hvc.continue();
                }
                catch (e) {
                    await detectError(e as Error);
                }
            }
        }
    }

    const controlling = async(set: boolean) => {
        const hvm = hvc.getHVM();
        const hvmstate = hvm.getState();
        const debugstate = hvm.getDebugState();

        if(hvmstate === "EXECUÇÃO" && debugstate === "PAUSADO") {
            if(set) {
                await hvc.back();
                updateViewers(hvmstate);
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
        }
    }
    // ------------------------------------------------------------------------------- 
    hvc.addEventOutput((out: string) => {
        globals.actions.changeElementText(outwrite, out);
    });

    hvc.addEventInput(async() => {
        globals.actions.displayElement(cardmodal);

        readcard.value = "";
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
        updateViewers(HVMState);

        if(previous != HVMState && HVMState === "DESLIGADO") await terminate();

        previous = HVMState;
    });
    // ---------------------------------------------------------------------------
    runner.addEventListener("click", async() => await exec(true));
    debug.addEventListener("click", async() => await exec(false));
    
    back.addEventListener("click", async() => await controlling(true));
    forth.addEventListener("click", async() => await controlling(false));

    finish.addEventListener("click", async() => await terminate());
    pausecontinue.addEventListener("click", async() => await toggling());
    // ---------------------------------------------------------------------------
    document.addEventListener("keydown", async(e) => {
        const key = e.key.toLowerCase();
        const hvmstate = hvc.getHVM().getState();

        if(e.ctrlKey) {
            if(key === "c" && hvmstate != "DESLIGADO") {
                e.preventDefault();
                await terminate();
            }
            else if(e.code === "Space") {
                e.preventDefault();
                await toggling();
            }
            else if(key === "arrowleft") await controlling(true);
            else if(key === "arrowright") await controlling(false);
        }
        else {
            if(key === "f9") await exec(true);
            else if(key === "f8") await exec(false);
        }
    });
}