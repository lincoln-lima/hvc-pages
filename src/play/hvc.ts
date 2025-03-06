import { play } from "../playground";
import { globals } from "../default";
import { HVC, HVMState } from "hvcjs";
// -----------------------------------------------------------------------------------
import ahv from "./ahv";
// -----------------------------------------------------------------------------------
export default (lang: string) => {
    ahv();
    // ------------------------------------------------------------------------------- 
    const hvc = new HVC();
    HVC.setLanguageMessages(lang);
    // ------------------------------------------------------------------------------- 
    const runner = play.elements.run();
    const debug = play.elements.debug();

    const clear = play.elements.clear();
    const options = play.elements.options();
    const savecode = play.elements.savecode();

    const back = play.elements.back();
    const forth = play.elements.forth();
    const finish = play.elements.finish();
    const pausecontinue = play.elements.pausecontinue();

    const outwrite = play.elements.out();
    const epiwrite = play.elements.epi();
    const acumulator = play.elements.acumulator();

    const drawers = play.elements.drawers();

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
    const saveCode = () => {
        if(localStorage.getItem("saved") != "true") {
            globals.actions.changeStorage("saved", "true");
            globals.actions.changeStorage("code", play.actions.getCode());

            editor.classList.remove("unsaved");

            globals.actions.temporaryClass(savecode, "saved");
        }
    }

    const clearView = () => {
        globals.actions.changeElementText(outwrite, "");
        globals.actions.changeElementText(epiwrite, "");
        globals.actions.changeElementText(acumulator, "");

        drawers.forEach(drawer => {
            const content = play.elements.drawercontent(drawer);

            globals.actions.changeElementText(content, "");
            drawer.classList.remove(drawer.classList.item(1)!);
        });

        globals.actions.temporaryClass(clear, "cleaned");
    }

    const exec = async(set: boolean) => {
        await terminate();
        // ---------------------------------------------------------------------------
        play.actions.hideModals();
        globals.actions.switchDisplay(options, false);
        // ---------------------------------------------------------------------------
        globals.actions.changeElementText(outwrite, "");
        
        drawers.forEach(gaveta => play.actions.highlightDrawer(gaveta, "default"));
        // ---------------------------------------------------------------------------
        document.addEventListener("keydown", keyTerminate);
        // ---------------------------------------------------------------------------
        hvc.setCode(play.actions.getCode());
        // ---------------------------------------------------------------------------
        try {
            if(set) await hvc.run();
            else {
                globals.actions.switchDisplay(editor, false);
                globals.actions.switchDisplay(tablecards, true);
                globals.actions.switchVisibility(debugmenu, true);

                back.addEventListener("click", backward);
                forth.addEventListener("click", forward);
                finish.addEventListener("click", terminate);
                pausecontinue.addEventListener("click", toggling);

                await hvc.debug(+delay.value, !skip.checked, paused.checked ? "PAUSADO" : "RODANDO");
            }
        }
        catch (e) {
            await detectError(e as Error);
        }
        finally {
            if(localStorage.getItem("askrating") != "false") {
                const counter = +play.elements.counter() + 1;
                globals.actions.changeStorage("counter", counter.toString());

                if(counter % 5 === 0) globals.actions.switchDisplay(ratingmodal, true);
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
        drawers.forEach((drawer, i) => {
            let value;
            const content = play.elements.drawercontent(drawer);

            if(gavetas[i]) {
                value = gavetas[i];

                if(epi != i) {
                    const style = (endindex === -1 || i <= endindex) ? "code" : "data";
                    play.actions.highlightDrawer(drawer, style);
                }
            }
            else value = "---";

            globals.actions.changeElementText(content, value);
        });
    }

    const terminate = async() => {
        hvc.finish();

        previous = "DESLIGADO";
        play.actions.setState(previous);

        play.actions.switchPauseContinue(paused.checked);

        globals.actions.switchDisplay(editor, true);
        globals.actions.switchDisplay(options, true);

        globals.actions.switchDisplay(cardmodal, false);
        globals.actions.switchDisplay(tablecards, false);

        globals.actions.switchVisibility(debugmenu, false);

        back.removeEventListener("click", backward);
        forth.removeEventListener("click", forward);
        finish.removeEventListener("click", terminate);
        pausecontinue.removeEventListener("click", toggling);

        document.removeEventListener("keydown", keyTerminate);
    }

    const toggling = async() => {
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

    const backward = async() => {
        const hvm = hvc.getHVM();
        const hvmstate = hvm.getState();

        await hvc.back();
        updateViewers(hvmstate);
        globals.actions.switchDisplay(cardmodal, false);
    }

    const forward = async() => {
        try {
            await hvc.next();
        }
        catch (e) {
            await detectError(e as Error);
        }
    }
    // ------------------------------------------------------------------------------- 
    hvc.addEventOutput((out: string) => globals.actions.changeElementText(outwrite, out));

    hvc.addEventInput(async() => {
        globals.actions.switchDisplay(cardmodal, true);

        readcard.value = "";
        readcard.focus();

        return new Promise(resolve => {
            const submit = (e: SubmitEvent) => {
                e.preventDefault();

                globals.actions.switchDisplay(cardmodal, false);
                setTimeout(resolve, +delay.value, readcard.value);

                formcard.removeEventListener("submit", submit);
            }

            formcard.addEventListener("submit", submit);
        });
    });

    hvc.addEventClock(async HVMState => {
        updateViewers(HVMState);

        if(previous != HVMState && HVMState === "DESLIGADO") await terminate();

        previous = HVMState;
    });
    // ---------------------------------------------------------------------------
    debug.addEventListener("click", async() => await exec(false));
    runner.addEventListener("click", async() => await exec(true));

    clear.addEventListener("click", clearView);
    savecode.addEventListener("click", saveCode);
    // ---------------------------------------------------------------------------
    const keyTerminate = async(e: KeyboardEvent) => {
        if(e.ctrlKey && e.key.toLowerCase() === "c") {
            e.preventDefault();
            await terminate();
        }
    }
    // ------------------------------------------------------------------------------- 
    document.addEventListener("keydown", async(e) => {
        const key = e.key.toLowerCase();

        if(e.ctrlKey) {
            if(key === "s") {
                e.preventDefault();
                saveCode();
            }
        }
        else {
            if(key === "f9") await exec(true);
            else if(key === "f8") await exec(false);
        }
    });
}