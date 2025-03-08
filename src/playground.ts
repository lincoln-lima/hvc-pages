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
export const actions = {
    getCode: () => { return CodeEditor.getInstance().getCode() },
    setCode: (code: string) => { CodeEditor.getInstance().setCode(code) }
}
// -------------------------------------------------------------------------------
const share = document.getElementById("share")!;
const scrollgaveteiro = document.querySelector(".scroll-gaveteiro")!;

const expand = document.querySelector(".expand")!;
const ablecontract = document.querySelectorAll(":has(~ .expand)");

const options = document.querySelector(".show-options")!;
const moreoptions = document.querySelector(".more-options")!;
// -------------------------------------------------------------------------------
options.addEventListener("click", () => {
    options.classList.toggle("contract");
    globals.switchVisibility(moreoptions);
});

expand.addEventListener("click", () => {
    expand.classList.toggle("contract");

    ablecontract.forEach(e => e.classList.toggle("contracted"));
});

share.addEventListener("click", async() => {
    const shareurl = globals.hvcode(actions.getCode()).toString();

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
drawers(scrollgaveteiro);
// -------------------------------------------------------------------------------
await modals();

const help = document.getElementById("help")!;
const configs = document.getElementById("config")!;

const openmodals: [Element, Element][] = [
    [help, modal.help()],
    [configs, modal.config()]
];

openModals(openmodals);
// -------------------------------------------------------------------------------
export const elements = {
    editor: document.querySelector(".container-editor")!,

    skip: modal.config().querySelector<HTMLInputElement>("#skip")!,
    delay: modal.config().querySelector<HTMLInputElement>("#delay")!,
    paused: modal.config().querySelector<HTMLInputElement>("#paused")!
}
// -------------------------------------------------------------------------------
const dontask = document.getElementById("dont-ask")!;
const formconfigs = document.getElementById("configs-form")!;
const theme = document.querySelector<HTMLSelectElement>("#theme")!;
// -------------------------------------------------------------------------------
theme.value = globals.getTheme();

elements.delay.value = localStorage.getItem("delay-hvc") || "1000";
elements.skip.checked = localStorage.getItem("skip-hvc")! != "false";
elements.paused.checked = localStorage.getItem("paused-hvc")! != "false";
// -------------------------------------------------------------------------------
CodeEditor.getInstance().init(elements.editor);
// -------------------------------------------------------------------------------
hvc(globals.getLang());
// -------------------------------------------------------------------------------
ahv();
// -------------------------------------------------------------------------------
const saveConfigs = () => {
    localStorage.setItem("delay-hvc", elements.delay.value!);
    localStorage.setItem("skip-hvc", elements.skip.checked.toString());
    localStorage.setItem("paused-hvc", elements.paused.checked.toString());

    globals.switchDisplay(modal.config(), false);
}
// -------------------------------------------------------------------------------
theme.addEventListener("change", globals.switchTheme);

formconfigs.addEventListener("submit", e => {
    e.preventDefault();
    saveConfigs();
});

dontask.addEventListener("click", () => {
    localStorage.setItem("askrating", "false");
    globals.switchDisplay(modal.rating(), false);
});
// -------------------------------------------------------------------------------
window.addEventListener("beforeunload", e => {
    if(localStorage.getItem("saved")! != "true" && actions.getCode() != localStorage.getItem("code")) e.preventDefault();
});

window.addEventListener("storage", e => {
    if(e.key === "theme") theme.value = e.newValue!;
});
// -------------------------------------------------------------------------------
if(!localStorage.getItem("counter") || !localStorage.getItem("askrating")) {
    localStorage.setItem("counter", "0");
    localStorage.setItem("askrating", "true");
}