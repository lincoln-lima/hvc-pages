import { HVC, HVMState } from "hvcjs";
import { modal, hideModals, modalsKeyEvents } from "./modals";
import { getCode, editor, skip, delay, paused } from "../playground";
import { switchDisplay, switchVisibility, changeElementText, scrollTo, temporaryClass, getLang, primarymenu } from "../globals";
// -----------------------------------------------------------------------------------
export default () => {
    const hvc = new HVC();
    HVC.setLanguageMessages(getLang());
    // ------------------------------------------------------------------------------- 
    let previous : HVMState = "DESLIGADO";
    // ------------------------------------------------------------------------------- 
    const cardmodal = modal.card();
    const errorsmodal = modal.errors();
    const ratingmodal = modal.rating();
    // ------------------------------------------------------------------------------- 
    const runner = primarymenu.querySelector("#run")!;
    const debug = primarymenu.querySelector("#debug")!;

    const clear = document.getElementById("clear")!;

    const errormessage = errorsmodal.querySelector<HTMLElement>("#error-message")!;

    const debugmenu = document.querySelector(".debug-menu")!;
    const stateview = document.querySelector(".states-view")!;

    const back = debugmenu.querySelector("#back")!;
    const forth = debugmenu.querySelector("#forth")!;
    const finish = debugmenu.querySelector("#finish")!;
    const pausecontinue = debugmenu.querySelector("#pause-continue")!;

    const epiwrite = document.querySelector("#epi .viewers-values")!;
    const accumulator = document.querySelector("#acumulador .viewers-values")!;
    const outwrite = document.querySelector("#folha-de-saida .viewers-values")!;

    const drawers = document.querySelectorAll(".drawer")!;

    const tablecards = document.querySelector(".scroll-tablecards")!;
    const cards = tablecards.querySelector<HTMLTableElement>(".cards")!;

    const formcard = cardmodal.querySelector<HTMLFormElement>("#card-form")!;
    const readcard = formcard.querySelector<HTMLInputElement>("#read-card")!;

    const optionscontainer = document.querySelector(".fixed-container")!;
    // ------------------------------------------------------------------------------- 
    const exec = async(set: boolean) => {
        await terminate();
        // ---------------------------------------------------------------------------
        switchDisplay(optionscontainer, false);
        // ---------------------------------------------------------------------------
        changeElementText(outwrite, "");

        drawers.forEach(gaveta => highlightDrawer(gaveta, "default"));
        // ---------------------------------------------------------------------------
        document.addEventListener("keydown", keyTerminate);
        document.removeEventListener("keydown", modalsKeyEvents);
        // ---------------------------------------------------------------------------
        hvc.setCode(getCode());
        // ---------------------------------------------------------------------------
        try {
            if (set) await hvc.run();
            else {
                switchDisplay(editor, false);
                switchDisplay(tablecards, true);

                switchVisibility(debugmenu, true);

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
            if (localStorage.getItem("askrating") != "false") {
                const counter = +localStorage.getItem("counter")! + 1;
                localStorage.setItem("counter", counter.toString());

                if (counter % 5 === 0) switchDisplay(ratingmodal, true);
            }
        }
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
        setState(state);
        // ---------------------------------------------------------------------------
        cards.innerHTML = "";

        portaCartoes.forEach(addCardToTable);
        // ---------------------------------------------------------------------------
        changeElementText(epiwrite, epi.toString());
        changeElementText(accumulator, acumulador >= 0 ? acumulador.toString().padStart(3, "0") : "-" + (acumulador * -1).toString().padStart(2, "0"));
        // ---------------------------------------------------------------------------
        highlightDrawer(pointed, "pointed");

        if (state != "CARGA") scrollTo(pointed);
        // ---------------------------------------------------------------------------
        drawers.forEach((drawer, i) => {
            let value;
            const content = drawerContent(drawer);

            if (gavetas[i]) {
                value = gavetas[i];

                if (epi != i) {
                    const style = (endindex === -1 || i <= endindex) ? "code" : "data";
                    highlightDrawer(drawer, style);
                }
            }
            else value = "---";

            changeElementText(content, value);
        });
    }

    const terminate = async() => {
        hvc.finish();

        previous = "DESLIGADO";
        setState(previous);

        switchPauseContinue(paused.checked);

        hideModals();

        switchDisplay(editor, true);
        switchDisplay(tablecards, false);
        switchDisplay(optionscontainer, true);

        switchVisibility(debugmenu, false);

        back.removeEventListener("click", backward);
        forth.removeEventListener("click", forward);
        finish.removeEventListener("click", terminate);
        pausecontinue.removeEventListener("click", toggling);

        document.removeEventListener("keydown", keyTerminate);
        document.addEventListener("keydown", modalsKeyEvents);
    }

    const detectError = async(e: Error) => {
        await terminate();
        errormessage.innerText = e.message.replace(/\.(?!$)/, ".\n");

        switchDisplay(errorsmodal, true);
    }
    // ------------------------------------------------------------------------------- 
    const switchPauseContinue = (set: boolean) => pausecontinue.classList.toggle("pause", !set);
    // ------------------------------------------------------------------------------- 
    const toggling = async() => {
        const topause = pausecontinue.classList.contains("pause");

        switchPauseContinue(topause);

        if (topause) await hvc.stop();
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
        switchDisplay(cardmodal, false);
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
    const setState = (state: HVMState) => {
        let dotclass;

        switch(state) {
            case "CARGA":
                dotclass = "loading";
                break;
            case "EXECUÇÃO":
                dotclass = "running";
                break;
            default:
                dotclass = "editing";
        }

        stateview.classList.replace(stateview.classList.item(1)!, dotclass);
    }
    // ------------------------------------------------------------------------------- 
    const drawerContent = (drawer: Element) => { return drawer.querySelector(".content")! };

    const highlightDrawer = (drawer: Element, style: string) => {
        if (!drawer.classList.contains(style)) {
            drawer.classList.remove(drawer.classList.item(1)!);
            drawer.classList.add(style);
        }
    }
    // ------------------------------------------------------------------------------- 
    const addCardToTable = (card: string) => {
        const line = document.createElement("tr");
        const data = document.createElement("td");

        data.textContent = card;

        line.appendChild(data);
        cards.appendChild(line);
    };
    // ------------------------------------------------------------------------------- 
    const clearView = () => {
        changeElementText(outwrite, "");
        changeElementText(epiwrite, "");
        changeElementText(accumulator, "");

        drawers.forEach(drawer => {
            const content = drawerContent(drawer);

            changeElementText(content, "");
            drawer.classList.remove(drawer.classList.item(1)!);
        });

        temporaryClass(clear, "cleaned");
    }

    // ------------------------------------------------------------------------------- 
    hvc.addEventOutput((out: string) => changeElementText(outwrite, out));

    hvc.addEventInput(async() => {
        switchDisplay(cardmodal, true);

        readcard.focus();

        return new Promise(resolve => {
            const submit = (e: SubmitEvent) => {
                e.preventDefault();

                switchDisplay(cardmodal, false);
                setTimeout(resolve, +delay.value, readcard.value);

                formcard.removeEventListener("submit", submit);
            }

            formcard.addEventListener("submit", submit);
        });
    });

    hvc.addEventClock(async HVMState => {
        updateViewers(HVMState);

        if (previous != HVMState && HVMState === "DESLIGADO") await terminate();

        previous = HVMState;
    });
    // ---------------------------------------------------------------------------
    debug.addEventListener("click", async() => await exec(false));
    runner.addEventListener("click", async() => await exec(true));

    clear.addEventListener("click", clearView);
    // ---------------------------------------------------------------------------
    const keyTerminate = async(e: KeyboardEvent) => {
        if (e.ctrlKey && e.key.toLowerCase() === "c") {
            e.preventDefault();
            await terminate();
        }
    }
    // ------------------------------------------------------------------------------- 
    document.addEventListener("keydown", async(e) => {
        const key = e.key.toLowerCase();

        if (!e.ctrlKey) {
            if (key === "f9") await exec(true);
            else if (key === "f8") await exec(false);
        }
    });
}