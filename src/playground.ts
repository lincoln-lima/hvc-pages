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
        contracted: () => { return document.getElementsByClassName("contracted")! },

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

        savecode: () => { return document.getElementById("save-code")! },
        clear: () => { return document.getElementById("clear")! },
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

            stateview.className = dotclass;
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
            Array.from(play.elements.modals()).forEach(modal => {
                const element = modal as HTMLElement;

                if(!element.isSameNode(play.elements.cardmodal())) {
                    globals.actions.undisplayElement(element);

                    if(element.isSameNode(play.elements.helpmodal())) globals.actions.displayElement(play.elements.help());
                }
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
const hideRating = () => globals.actions.undisplayElement(play.elements.ratingmodal());

const neverAskAgain = () => {
    hideRating();
    globals.actions.changeStorage("askrating", "false");
}

const saveConfigs = () => {
    globals.actions.changeStorage("delay-hvc", play.elements.delay().value!);
    globals.actions.changeStorage("skip-hvc", play.elements.skip().checked.toString());
    globals.actions.changeStorage("paused-hvc", play.elements.paused().checked.toString());

    globals.actions.undisplayElement(play.elements.configmodal());
}

const switchHelp = () => globals.actions.switchDisplay(play.elements.helpmodal());

const switchContracted = (i: number) => {
    const expand = play.elements.expand().item(i)!;
    const contracted = play.elements.contracted().item(i)! as HTMLElement;

    expand.classList.toggle("contract");

    globals.actions.switchVisibility(contracted, contracted.style["visibility"] != "visible");
}
// -------------------------------------------------------------------------------
Array.from(play.elements.expand()).forEach((e, i) => e.addEventListener("click", () => switchContracted(i)));
Array.from(play.elements.contracted()).forEach(e => globals.actions.switchVisibility(e as HTMLElement, false));
// -------------------------------------------------------------------------------
window.addEventListener("beforeunload", e => {
    if(localStorage.getItem("saved")! != "true" && play.actions.getCode() != localStorage.getItem("code")) e.preventDefault();
});

window.addEventListener("storage", e => {
    if(e.key === "theme") play.elements.theme().value = e.newValue!;
});
// -------------------------------------------------------------------------------
document.addEventListener("click", e => {
    const element = e.target as HTMLElement;

    if(element.isSameNode(play.elements.helpmodal())) switchHelp();
    else if(element.isSameNode(play.elements.configmodal())) globals.actions.undisplayElement(play.elements.configmodal());

    const isExpand = !element.parentElement!.parentElement!.classList.contains("contracted") &&
                     !element.parentElement!.classList.contains("contracted") &&
                     !element.classList.contains("expand");

    if(isExpand) {
        Array.from(play.elements.contracted()).forEach((e, i) => {
            if((e as HTMLElement).style["visibility"] != "hidden") switchContracted(i);
        });
    }
});

document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();

    if(!e.ctrlKey) {
        if(key === "f2") {
            e.preventDefault();
            
            globals.actions.switchDisplay(play.elements.configmodal());
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
        const shareurl = globals.actions.hvcode(play.actions.getCode());

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

    play.elements.configs().addEventListener("click", () => globals.actions.displayElement(play.elements.configmodal()));
    play.elements.closeconfigs().addEventListener("click", () => globals.actions.undisplayElement(play.elements.configmodal()));
    play.elements.formconfigs().addEventListener("submit", e => {
        e.preventDefault();
        saveConfigs();
    });

    play.elements.theme().addEventListener("change", globals.actions.switchTheme);

    play.elements.dontask().addEventListener("click", neverAskAgain);
    play.elements.closerating().addEventListener("click", hideRating);
    play.elements.ratingstars().addEventListener("click", hideRating);

    play.elements.help().addEventListener("click", switchHelp);
    play.elements.closeerrors().addEventListener("click", () => globals.actions.undisplayElement(play.elements.errorsmodal()));
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