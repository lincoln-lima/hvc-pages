import "/src/styles/playground/playground.scss";
import "/src/styles/defaults/modal.scss";
import "/src/styles/defaults/table.scss";
// -------------------------------------------------------------------------------
import { CodeEditor } from "./play/codemirror";
import { modal, openModals } from "./play/modals";
import { monitoreMenu, switchDisplay, switchTheme, switchVisibility, hvcode, retrieveLangText, temporaryClass, getTheme } from "./globals";
// -------------------------------------------------------------------------------
import ahv from "./play/ahv";
import hvc from "./play/hvc";
import modals from "./play/modals";
import drawers from "./play/drawers";
// -------------------------------------------------------------------------------
const windowsizemenu = 680;
// -------------------------------------------------------------------------------
monitoreMenu(windowsizemenu);
window.addEventListener("resize", () => monitoreMenu(windowsizemenu));
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
    switchVisibility(moreoptions);
});

expand.addEventListener("click", () => {
    expand.classList.toggle("contract");

    ablecontract.forEach(e => e.classList.toggle("contracted"));
});

share.addEventListener("click", async() => {
    const shareurl = hvcode(getCode()).toString();

    try {
        await navigator.share({
            title: document.title,
            text: retrieveLangText("menu-share-metaop") + "\n\n",
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
            temporaryClass(share, "copied", label!, "menu-share-title", "menu-copied-title");
        }
    }
});
// -------------------------------------------------------------------------------
drawers(scrollgaveteiro);
// -------------------------------------------------------------------------------
await modals();

const helpmodal = modal.help();
const configmodal = modal.config();
const ratingmodal = modal.rating();
// -------------------------------------------------------------------------------
const help = document.getElementById("help")!;
const configs = document.getElementById("config")!;

const openmodals: [Element, Element][] = [
    [help, helpmodal],
    [configs, configmodal]
];

openModals(openmodals);
// -------------------------------------------------------------------------------
export const editor = document.querySelector(".container-editor")!;
export const skip = configmodal.querySelector<HTMLInputElement>("#skip")!;
export const delay = configmodal.querySelector<HTMLInputElement>("#delay")!;
export const paused = configmodal.querySelector<HTMLInputElement>("#paused")!;
// -------------------------------------------------------------------------------
const dontask = document.getElementById("dont-ask")!;
const formconfigs = document.getElementById("configs-form")!;
const theme = document.querySelector<HTMLSelectElement>("#theme")!;
const showtips = configmodal.querySelector<HTMLInputElement>("#show-tips")!;
// -------------------------------------------------------------------------------
theme.value = getTheme();

delay.value = localStorage.getItem("delay-hvc") || "1000";
skip.checked = localStorage.getItem("skip-hvc")! != "false";
paused.checked = localStorage.getItem("paused-hvc")! != "false";
showtips.checked = localStorage.getItem("show-tips")! != "false";
// -------------------------------------------------------------------------------
CodeEditor.getInstance().init(editor);

export const getCode =  () => { return CodeEditor.getInstance().getCode() };
export const setCode =  (code: string) => CodeEditor.getInstance().setCode(code);
// -------------------------------------------------------------------------------
hvc();
ahv();
// -------------------------------------------------------------------------------
const showTips = (set: boolean) => document.body.classList.toggle("dont-show-tips", !set);

const saveConfigs = () => {
    localStorage.setItem("delay-hvc", delay.value!);
    localStorage.setItem("skip-hvc", skip.checked.toString());
    localStorage.setItem("paused-hvc", paused.checked.toString());
    
    if(localStorage.getItem("show-tips") != showtips.checked.toString()) {
        const isCheck = showtips.checked;

        showTips(isCheck);
        localStorage.setItem("show-tips", isCheck.toString());
    }

    switchDisplay(configmodal, false);
}
// -------------------------------------------------------------------------------
if(localStorage.getItem("show-tips") != "true") showTips(false);
// -------------------------------------------------------------------------------
theme.addEventListener("change", switchTheme);

formconfigs.addEventListener("submit", e => {
    e.preventDefault();
    saveConfigs();
});

dontask.addEventListener("click", () => {
    localStorage.setItem("askrating", "false");
    switchDisplay(ratingmodal, false);
});
// -------------------------------------------------------------------------------
window.addEventListener("beforeunload", e => {
    if (localStorage.getItem("saved")! != "true" && getCode() != localStorage.getItem("code")) e.preventDefault();
});

window.addEventListener("storage", e => {
    if (e.key === "theme") theme.value = e.newValue!;
});
// -------------------------------------------------------------------------------
if (!localStorage.getItem("counter") || !localStorage.getItem("askrating")) {
    localStorage.setItem("counter", "0");
    localStorage.setItem("askrating", "true");
}