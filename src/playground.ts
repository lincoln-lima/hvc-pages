import { globals } from "./default";
import { getDoc, setDoc } from "./play/codemirror";
// -------------------------------------------------------------------------------
import hvc from "./play/hvc";
import templates from "./templates";
import drawers from "./play/drawers";
// -------------------------------------------------------------------------------
import "/src/styles/defaults/table.scss";
import "/src/styles/defaults/modal.scss";
import "/src/styles/playground/playground.scss";
// -------------------------------------------------------------------------------
export const play = {
    elements: {
        epi: () => { return document.getElementById("epi")!.querySelector(".viewers-values")! },
        out: () => { return document.getElementById("folha-de-saida")!.querySelector(".viewers-values")! },
        acumulator: () => { return document.getElementById("acumulador")!.querySelector(".viewers-values")! },

        readcard: () => { return document.querySelector<HTMLInputElement>("#read-card")! },

        run: () => { return document.getElementById("run")! },
        debug: () => { return document.getElementById("debug")! },
        share: () => { return document.getElementById("share")! },
        import: () => { return document.getElementById("import")! },
        export: () => { return document.getElementById("export")! },

        expand: () => { return document.querySelectorAll(".expand")! },
        contracted: () => { return document.querySelectorAll(".contracted")! },

        state: () => { return document.querySelector(".states-view")! },
        debugmenu: () => { return document.querySelector(".debug-menu")! },

        editor: () => { return document.querySelector(".container-editor")! },

        back: () => { return document.getElementById("back")! },
        forth: () => { return document.getElementById("forth")! },
        finish: () => { return document.getElementById("finish")! },
        pausecontinue: () => { return document.getElementById("pause-continue")! },

        helpmodal: () => { return document.getElementById("help-modal")! },
        cardmodal: () => { return document.getElementById("card-modal")! },
        errorsmodal: () => { return document.getElementById("error-modal")! },
        configmodal: () => { return document.getElementById("config-modal")! },
        ratingmodal: () => { return document.getElementById("rating-modal")! },

        modals: () => { return document.querySelectorAll(".mymodal")! },
        closeablesmodals: () => { return document.querySelectorAll(".mymodal:has(.close)")! },

        configs: () => { return document.getElementById("config")! },
        formconfigs: () => { return document.getElementById("configs-form")! },

        formcard: () => { return document.getElementById("card-form")! },

        error: () => { return document.getElementById("error-message")! },

        help: () => { return document.getElementById("help")! },
        clear: () => { return document.getElementById("clear")! },
        options: () => { return document.getElementById("options")! },
        savecode: () => { return document.getElementById("save-code")! },

        skip: () => { return document.querySelector<HTMLInputElement>("#skip")! },
        delay: () => { return document.querySelector<HTMLInputElement>("#delay")! },
        theme: () => { return document.querySelector<HTMLSelectElement>("#theme")! },
        paused: () => { return document.querySelector<HTMLInputElement>("#paused")! },

        scrollgaveteiro: () => { return document.querySelector(".scroll-gaveteiro")! },

        drawers: () => { return document.querySelectorAll(".drawer")! },
        drawercontent: (drawer: Element) => { return drawer.querySelector(".content")! },

        cards: () => { return document.querySelector(".cards")! },
        tablecards: () => { return document.querySelector(".scroll-tablecards")! },

        counter: () => { return localStorage.getItem("counter")! },
        askrating: () => { return localStorage.getItem("askrating")! },
        dontask: () => { return document.getElementById("dont-ask")! },
        ratingstars: () => { return document.getElementById("rating")! },
    },
    actions: {
        getCode: () => {
            return getDoc();
        },

        setCode: (code: string) => {
            setDoc(code);
        },

        setState: (state: string) => {
            let dotclass;
            const stateview = play.elements.state();

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
        },

        showError: (message: string) => {
            play.elements.error().innerText = message.replace(/\.(?!$)/, ".\n");
            globals.actions.switchDisplay(play.elements.errorsmodal(), true);
        },

        highlightDrawer: (drawer: Element, style: string) => {
            if(!drawer.classList.contains(style)) {
                drawer.classList.remove(drawer.classList.item(1)!);
                drawer.classList.add(style);
            }
        },

        switchPauseContinue: (set: boolean) => {
            const pausecontinue = play.elements.pausecontinue();

            if(set) pausecontinue.classList.remove("pause");
            else pausecontinue.classList.add("pause");
        },

        addCardToTable: (card: string) => {
            const line = document.createElement("tr");
            const data = document.createElement("td");

            data.textContent = card;

            line.appendChild(data);
            play.elements.cards().appendChild(line);
        },

        hideModals: () => {
            play.elements.modals().forEach(modal => {
                if(!modal.isSameNode(play.elements.cardmodal())) globals.actions.switchDisplay(modal, false);
            });
        },
    }
}
// -------------------------------------------------------------------------------
const windowsizemenu = 710;
// -------------------------------------------------------------------------------
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener("resize", () => globals.actions.monitoreMenu(windowsizemenu));
// -------------------------------------------------------------------------------
if(!play.elements.counter() || !play.elements.askrating()) {
    globals.actions.changeStorage("counter", "0");
    globals.actions.changeStorage("askrating", "true");
}
// -------------------------------------------------------------------------------
const neverAskAgain = () => {
    globals.actions.changeStorage("askrating", "false");
    globals.actions.switchDisplay(play.elements.ratingmodal(), false);
}

const saveConfigs = () => {
    globals.actions.changeStorage("delay-hvc", play.elements.delay().value!);
    globals.actions.changeStorage("skip-hvc", play.elements.skip().checked.toString());
    globals.actions.changeStorage("paused-hvc", play.elements.paused().checked.toString());

    globals.actions.switchDisplay(play.elements.configmodal(), false);
}

const switchHelp = () => {
    const helpmodal = play.elements.helpmodal();

    globals.actions.switchDisplay(helpmodal, helpmodal.classList.contains("undisplayed"));
}

const switchContracted = (i: number) => {
    const expand = play.elements.expand().item(i)!;
    const contracted = play.elements.contracted().item(i)!;

    expand.classList.toggle("contract");

    globals.actions.switchVisibility(contracted, contracted.classList.contains("unvisible"));
}
// -------------------------------------------------------------------------------
play.elements.expand().forEach((e, i) => e.addEventListener("click", () => switchContracted(i)));
play.elements.contracted().forEach(e => globals.actions.switchVisibility(e, false));
// -------------------------------------------------------------------------------
window.addEventListener("beforeunload", e => {
    if(localStorage.getItem("saved")! != "true" && play.actions.getCode() != localStorage.getItem("code")) e.preventDefault();
});

window.addEventListener("storage", e => {
    if(e.key === "theme") play.elements.theme().value = e.newValue!;
});
// -------------------------------------------------------------------------------
document.addEventListener("click", e => {
    const element = e.target as Element;

    if(element.isSameNode(play.elements.helpmodal())) switchHelp();
    else if(element.isSameNode(play.elements.configmodal())) globals.actions.switchDisplay(play.elements.configmodal(), false);

    const isExpand = !element.parentElement!.parentElement!.classList.contains("contracted") &&
                     !element.parentElement!.classList.contains("contracted") &&
                     !element.classList.contains("expand");

    if(isExpand) {
        play.elements.contracted().forEach((e, i) => {
            if(!e.classList.contains("unvisible")) switchContracted(i);
        });
    }
});

document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();

    if(!e.ctrlKey) {
        if(key === "f2") {
            const configmodal = play.elements.configmodal();

            e.preventDefault();
            globals.actions.switchDisplay(configmodal, configmodal.classList.contains("undisplayed"));
        }
        else if(key === "f12") {
            e.preventDefault();
            switchHelp();
        }
        else if(key === "escape") play.actions.hideModals();
    }
});
// ---------------------------------------------------------------------------
const loadplay = async () => {
    hvc(globals.actions.getLang());
    // -----------------------------------------------------------------------
    play.elements.theme().value = globals.actions.getTheme();
    play.elements.delay().value = localStorage.getItem("delay-hvc") || "1000";

    play.elements.skip().checked = localStorage.getItem("skip-hvc")! != "false";
    play.elements.paused().checked = localStorage.getItem("paused-hvc")! != "false";
    // -----------------------------------------------------------------------
    play.elements.share().addEventListener("click", async(e) => {
        const share = e.currentTarget as Element;
        const shareurl = globals.actions.hvcode(play.actions.getCode()).toString();

        try {
            await navigator.share({
                title: document.title,
                text: globals.actions.retrieveLangText("menu-share-metaop") + "\n\n",
                url: shareurl
            });
        }
        catch {
            const label = share.querySelector(".label-tool");

            try {
                navigator.clipboard.writeText(shareurl);
            }
            catch {
                console.log(shareurl);
            }
            finally {
                globals.actions.temporaryClass(share, "copied", label!, "menu-share-title", "menu-copied-title");
            }
        }
    });

    play.elements.configs().addEventListener("click", () => globals.actions.switchDisplay(play.elements.configmodal(), true));
    play.elements.formconfigs().addEventListener("submit", e => {
        e.preventDefault();
        saveConfigs();
    });

    play.elements.theme().addEventListener("change", globals.actions.switchTheme);

    play.elements.dontask().addEventListener("click", neverAskAgain);
    play.elements.ratingstars().addEventListener("click", () => globals.actions.switchDisplay(play.elements.ratingmodal(), false));

    play.elements.help().addEventListener("click", switchHelp);

    play.elements.closeablesmodals().forEach(modal => {
        const close = modal.querySelector(".close")!;

        close.addEventListener("click", () => globals.actions.switchDisplay(modal, false));
    })
    // ---------------------------------------------------------------------------
    const table = await templates("table");
    globals.actions.translateElement(table);

    play.elements.helpmodal().querySelector(".modal-body")!.appendChild(table);
}
// -------------------------------------------------------------------------------
drawers(play.elements.scrollgaveteiro());
// -------------------------------------------------------------------------------
const modals = ["configs", "card", "error", "help", "rating"];

await Promise.all(modals.map(async modal => {
    const element = await templates("modal/" + modal);
    element.classList.add("undisplayed");

    globals.actions.translateElement(element);

    document.body.appendChild(element);
}));

await loadplay();