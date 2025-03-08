import "/src/styles/playground/playground.scss";
import "/src/styles/defaults/modal.scss";
import "/src/styles/defaults/table.scss";
// -------------------------------------------------------------------------------
import { globals } from "./default";
import { CodeEditor } from "./play/codemirror";
import { modal, openModals } from "./play/modals";
// -------------------------------------------------------------------------------
import ahv from "./play/ahv";
import hvc from "./play/hvc";
import modals from "./play/modals";
import drawers from "./play/drawers";
// -------------------------------------------------------------------------------
const windowsizemenu = 680;
// -------------------------------------------------------------------------------
globals.monitoreMenu(windowsizemenu);
window.addEventListener("resize", () => globals.monitoreMenu(windowsizemenu));
// -------------------------------------------------------------------------------
export const play = {
    options: () => { return document.getElementById("options")! },
    
    editor: () => { return document.querySelector(".container-editor")! },

    skip: () => { return modal.config().querySelector<HTMLInputElement>("#skip")! },
    delay: () => { return modal.config().querySelector<HTMLInputElement>("#delay")! },
    paused: () => { return modal.config().querySelector<HTMLInputElement>("#paused")! },

    getCode: () => { return CodeEditor.getInstance().getCode() },
    setCode: (code: string) => { CodeEditor.getInstance().setCode(code) }
}
// -------------------------------------------------------------------------------
const share = document.getElementById("share")!;
const scrollgaveteiro = document.querySelector(".scroll-gaveteiro")!;

const expand = document.querySelectorAll(".expand")!;
const contracted = document.querySelectorAll(".contracted")!;
// -------------------------------------------------------------------------------
if(!localStorage.getItem("counter") || !localStorage.getItem("askrating")) {
    globals.changeStorage("counter", "0");
    globals.changeStorage("askrating", "true");
}
// -------------------------------------------------------------------------------
contracted.forEach(e => globals.switchVisibility(e, false));
expand.forEach((e, i) => e.addEventListener("click", () => switchContracted(i)));

share.addEventListener("click", async() => {
    const shareurl = globals.hvcode(play.getCode()).toString();

    try {
        await navigator.share({
            title: document.title,
            text: globals.retrieveLangText("menu-share-metaop") + "\n\n",
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
            globals.temporaryClass(share, "copied", label!, "menu-share-title", "menu-copied-title");
        }
    }
});
// -------------------------------------------------------------------------------
document.addEventListener("click", e => {
    const element = e.target as Element;

    const isExpand = !element.parentElement!.parentElement!.classList.contains("contracted") &&
                     !element.parentElement!.classList.contains("contracted") &&
                     !element.classList.contains("expand");

    if(isExpand) {
        contracted.forEach((e, i) => {
            if(!e.classList.contains("unvisible")) switchContracted(i);
        });
    }
});

// -------------------------------------------------------------------------------
const saveConfigs = () => {
    globals.changeStorage("delay-hvc", play.delay().value!);
    globals.changeStorage("skip-hvc", play.skip().checked.toString());
    globals.changeStorage("paused-hvc", play.paused().checked.toString());

    globals.switchDisplay(modal.config(), false);
}

const switchContracted = (i: number) => {
    const itemexpand = expand.item(i)!;
    const itemcontracted = contracted.item(i)!;

    itemexpand.classList.toggle("contract");

    globals.switchVisibility(itemcontracted, itemcontracted.classList.contains("unvisible"));
}
// -------------------------------------------------------------------------------
drawers(scrollgaveteiro);
// -------------------------------------------------------------------------------
await modals();
// -------------------------------------------------------------------------------
const help = document.getElementById("help")!;
const configs = document.getElementById("config")!;

const openmodals: [Element, Element][] = [
    [help, modal.help()],
    [configs, modal.config()]
];

openModals(openmodals);
// -------------------------------------------------------------------------------
const dontask = document.getElementById("dont-ask")!;
const formconfigs = document.getElementById("configs-form")!;
const theme = document.querySelector<HTMLSelectElement>("#theme")!;
// -------------------------------------------------------------------------------
theme.value = globals.getTheme();

play.delay().value = localStorage.getItem("delay-hvc") || "1000";
play.skip().checked = localStorage.getItem("skip-hvc")! != "false";
play.paused().checked = localStorage.getItem("paused-hvc")! != "false";
// -------------------------------------------------------------------------------
CodeEditor.getInstance().init(play.editor());
// -------------------------------------------------------------------------------
hvc(globals.getLang());
// -------------------------------------------------------------------------------
ahv();
// -------------------------------------------------------------------------------
dontask.addEventListener("click", () => {
    globals.changeStorage("askrating", "false");
    globals.switchDisplay(modal.rating(), false);
});

formconfigs.addEventListener("submit", e => {
    e.preventDefault();
    saveConfigs();
});

theme.addEventListener("change", globals.switchTheme);
// -------------------------------------------------------------------------------
window.addEventListener("beforeunload", e => {
    if(localStorage.getItem("saved")! != "true" && play.getCode() != localStorage.getItem("code")) e.preventDefault();
});

window.addEventListener("storage", e => {
    if(e.key === "theme") theme.value = e.newValue!;
});