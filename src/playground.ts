import { globals } from "./default";
import { getDoc, setDoc } from "./play/codemirror"
// ------------------------------------------------------------------------------- 
import hvc from "./play/hvc";
import templates from "./templates";
import drawers from "./play/drawers";
// ------------------------------------------------------------------------------- 
import "/src/styles/defaults/table.scss";
import "/src/styles/playground/playground.scss";
// ------------------------------------------------------------------------------- 
export const play = {
    elements: {
        epi: () => { return document.getElementById("epi-value")! },
        out: () => { return document.getElementById("saida-value")! },
        acumulator: () => { return document.getElementById("acumulador-value")! },
        readcard: () => { return document.getElementById("read-card")! as HTMLInputElement },
        
        run: () => { return document.getElementById("run")! },
        debug: () => { return document.getElementById("debug")! },
        share: () => { return document.getElementById("share")! },
        import: () => { return document.getElementById("import")! },
        export: () => { return document.getElementById("export")! },

        expand: () => { return document.getElementsByClassName("expand")! },
        contract: () => { return document.getElementsByClassName("contract")! },

        state: () => { return document.getElementById("states-view")! },
        debugmenu: () => { return document.getElementById("debug-menu")! },

        editor: () => { return document.getElementById("editor")! },
        portacartoes: () => { return document.getElementById("porta-cartoes")! },

        back: () => { return document.getElementById("back")! },
        forth: () => { return document.getElementById("forth")! },
        finish: () => { return document.getElementById("finish")! },
        pausecontinue: () => { return document.getElementById("pause-continue")! },

        helpmodal: () => { return document.getElementById("help-modal")! },
        cardmodal: () => { return document.getElementById("card-modal")! },
        errorsmodal: () => { return document.getElementById("error-modal")! },
        configmodal: () => { return document.getElementById("config-modal")! },
        ratingmodal: () => { return document.getElementById("rating-modal")! },

        modals: () => { return document.getElementsByClassName("mymodal")! },
    
        configs: () => { return document.getElementById("config")! },
        formconfigs: () => { return document.getElementById("configs-form")! },
        closeconfigs: () => { return document.getElementById("close-configs")! },
    
        formcard: () => { return document.getElementById("card-form")! },
    
        error: () => { return document.getElementById("error")! },
        closeerrors: () => { return document.getElementById("close-error")! },

        help: () => { return document.getElementById("help")! },
        
        skip: () => { return document.getElementById("skip")! as HTMLInputElement },
        delay: () => { return document.getElementById("delay")! as HTMLInputElement },
        theme: () => { return document.getElementById("theme")! as HTMLSelectElement },
        paused: () => { return document.getElementById("paused")! as HTMLInputElement },
        
        gaveteiro: () => { return document.getElementById("gaveteiro")! },
        scrollgaveteiro: () => { return document.getElementById("scroll-gaveteiro")! },

        drawers: () => { return document.getElementsByClassName("drawer")! },
        drawerscontent: () => { return document.getElementsByClassName("cont-drawer")! },

        cards: () => { return document.getElementById("cards")! },
        tablecards: () => { return document.getElementById("scroll-tablecards")! },
        
        counter: () => { return localStorage.getItem("counter")! },
        askrating: () => { return localStorage.getItem("askrating")! },
        dontask: () => { return document.getElementById("dont-ask")! },
        ratingstars: () => { return document.getElementById("rating")! },
        closerating: () => { return document.getElementById("close-rating")! }
    },
    actions: {
        getCode: () => {
            return getDoc();
        },
        
        setCode: (text: string) => {
            setDoc(text);
        },

        setState: (state: string) => {
            const stateview = play.elements.state();
            let dotclass;

            switch(state) {
                case "CARGA":
                    dotclass = "charging";
                    break;
                case "EXECUÇÃO":
                    dotclass = "running";
                    break;
                default:
                    dotclass = "editing";
            } 

            stateview.classList.replace(stateview.className, dotclass);
        },
    
        showError: (message: string) => {
            play.elements.error().innerText = message.replace(/\.(?!$)/, ".\n");
            globals.actions.displayElement(play.elements.errorsmodal());
        },
    
        highlightDrawer: (drawer: Element, style: string) => {
            if(!drawer.classList.contains(style)) {
                drawer.classList.remove(drawer.classList.item(1)!);
                drawer.classList.add(style);
            }
        },

        switchPauseContinue: (set: boolean) => {
            const actual = set ? "pause" : "continue";
            const switched = set ? "continue" : "pause";

            play.elements.pausecontinue().classList.replace(actual, switched);
        },

        addCardToTable: (card: string) => {
            const line = document.createElement("tr");
            const data = document.createElement("td");

            data.innerText = card;

            line.appendChild(data);
            play.elements.cards().appendChild(line);
        },

        hideModals: () => {
            Array.from(play.elements.modals()).forEach(modal => {
                const element = modal as HTMLElement;

                if(element != play.elements.cardmodal()) {
                    globals.actions.undisplayElement(element);
                
                    if(element == play.elements.helpmodal()) globals.actions.displayElement(play.elements.help());
                }
            });
        },
    }
}
// ------------------------------------------------------------------------------- 
const windowsizemenu = 730;
// ------------------------------------------------------------------------------- 
document.body.className = localStorage.getItem("theme-play") ? (localStorage.getItem("theme-play"))! : "lightmode";
// ------------------------------------------------------------------------------- 
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener("resize", () => globals.actions.monitoreMenu(windowsizemenu));
// ------------------------------------------------------------------------------- 
drawers(play.elements.scrollgaveteiro());
// ------------------------------------------------------------------------------- 
if(!play.elements.askrating() || !play.elements.counter()) {
    localStorage.setItem("askrating", "true");
    localStorage.setItem("counter", "0");
}
// ------------------------------------------------------------------------------- 
const modals = ["configs", "card", "error", "help", "rating"];

modals.forEach(async modal => {
    const element = await templates("modal/" + modal);
    element.style["display"] = "none";

    globals.actions.translateElement(element);
    
    document.body.appendChild(element);
});
// ------------------------------------------------------------------------------- 
const loadplay = async () => {
    hvc(globals.actions.getLang());
    // ---------------------------------------------------------------------------
    play.elements.skip().checked = (localStorage.getItem("skip-hvc"))! != "false";
    play.elements.paused().checked = (localStorage.getItem("paused-hvc"))! != "false";
    play.elements.delay().value = localStorage.getItem("delay-hvc") ? (localStorage.getItem("delay-hvc"))! : "1000";
    play.elements.theme().value = localStorage.getItem("theme-play") ? (localStorage.getItem("theme-play"))! : "lightmode";
    // ---------------------------------------------------------------------------
    const hideRating = () => {
        globals.actions.undisplayElement(play.elements.ratingmodal());
    }

    const neverAskAgain = () => {
        hideRating();
        localStorage.setItem("askrating", "false");
    }

    const saveConfigs = () => {
        globals.actions.changeStorage("delay-hvc", play.elements.delay().value!);
        globals.actions.changeStorage("theme-play", play.elements.theme().value!);
        globals.actions.changeStorage("skip-hvc", play.elements.skip().checked.toString());
        globals.actions.changeStorage("paused-hvc", play.elements.paused().checked.toString());

        globals.actions.undisplayElement(play.elements.configmodal());
    }

    const switchHelp = () => {
        const button = play.elements.help();
        const modal = play.elements.helpmodal();

        const modaldisplay = modal.style["display"] === "none";
        const buttondisplay = button.style["display"] === "none";
        
        globals.actions.switchDisplay(modal, modaldisplay);
        globals.actions.switchDisplay(button, buttondisplay);
    }

    const switchContract = (i: number) => {
        const contracted = play.elements.contract().item(i) as HTMLElement;

        globals.actions.switchVisibility(contracted, contracted.style["visibility"] != "visible");
    }
    // ---------------------------------------------------------------------------
    Array.from(play.elements.expand()).forEach((e, i) => e.addEventListener("click", () => switchContract(i)));
    Array.from(play.elements.contract()).forEach(e => globals.actions.switchVisibility(e as HTMLElement, false));

    play.elements.share().addEventListener("click", async() => {
        try {
            await navigator.share({
                title: document.title,
                text: "Veja meu código no HVC!\n\n",
                url: globals.actions.hvcode(play.actions.getCode())
            });
        }
        catch {
            const text = "Partilhar";
            
            play.elements.share().classList.add("copied");

            const label = play.elements.share().getElementsByClassName("label-tool").item(0)!;
            label.textContent = "Copiado!";

            navigator.clipboard.writeText(globals.actions.hvcode(play.actions.getCode()));

            setTimeout(() => {
                label.textContent = text;
                play.elements.share().classList.remove("copied");
            }, 3000);
        }
    });

    play.elements.configs().addEventListener("click", () => globals.actions.displayElement(play.elements.configmodal()));
    play.elements.closeconfigs().addEventListener("click", () => globals.actions.undisplayElement(play.elements.configmodal()));
    play.elements.formconfigs().addEventListener("submit", e => {
        e.preventDefault();
        saveConfigs();
    });

    play.elements.theme().addEventListener("change", () => {
        globals.actions.changeElementClass(document.body, play.elements.theme().value);
    });

    play.elements.dontask().addEventListener("click", neverAskAgain);
    play.elements.closerating().addEventListener("click", hideRating);
    play.elements.ratingstars().addEventListener("click", hideRating);

    play.elements.help().addEventListener("click", switchHelp);
    play.elements.closeerrors().addEventListener("click", () => globals.actions.undisplayElement(play.elements.errorsmodal()));
    // ---------------------------------------------------------------------------
    window.addEventListener("click", e => {
        const element = e.target as HTMLElement;

        if(element == play.elements.helpmodal()) switchHelp();
        else if(element == play.elements.configmodal()) globals.actions.undisplayElement(play.elements.configmodal());

        const isExpand = !element.classList.contains("contract") &&
                         !(element as HTMLElement).parentElement!.classList.contains("contract") &&
                         !(element as HTMLElement).parentElement!.parentElement!.classList.contains("contract") &&
                         !element.classList.contains("expand");

        if(isExpand) {
            Array.from(play.elements.contract()).forEach((e, i) => {
                if((e as HTMLElement).style["visibility"] != "hidden") switchContract(i);
            });
        }
    });
    // ---------------------------------------------------------------------------
    document.addEventListener("keydown", e => {
        const key = e.key.toLowerCase();

        if(!e.ctrlKey) {
            if(key === "f2") {
                e.preventDefault();
                const config = play.elements.configmodal();

                globals.actions.switchDisplay(config, config.style["display"] === "none");
            }
            else if(key === "f12") {
                e.preventDefault();
                switchHelp();
            }
            else if(key === "escape") play.actions.hideModals();
        }
    });
    // ---------------------------------------------------------------------------
    const table = await templates("table");
    globals.actions.translateElement(table);

    play.elements.helpmodal().getElementsByClassName("modal-body").item(0)!.appendChild(table);
}
// ------------------------------------------------------------------------------- 
setTimeout(async () => await loadplay(), modals.length * 150);