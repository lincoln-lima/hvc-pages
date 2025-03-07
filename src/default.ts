import "/src/styles/fonts.scss";
import "/src/styles/defaults/style.scss";
import "/src/styles/defaults/header.scss";
// -------------------------------------------------------------------------------
import { Transformer } from "./lang/Transformer";
// -------------------------------------------------------------------------------
export const globals = {
    switchDisplay: (element: Element, set: boolean) => {
        if(set) element.classList.remove("undisplayed");
        else element.classList.add("undisplayed")
    },

    switchVisibility: (element: Element, set: boolean) => {
        if(set) element.classList.remove("unvisible");
        else element.classList.add("unvisible")
    },

    switchTheme: () => {
        const theme = root.getAttribute("data-theme") != "dark" ? "dark" : "light";

        root.setAttribute("data-theme", theme);
        globals.changeStorage("theme", theme);
    },

    monitoreMenu: (size: number) => {
        const isWider = window.innerWidth > size;

        switchEventsMenu(false);

        globals.switchDisplay(menuburger, !isWider);
        globals.switchVisibility(primarymenu, isWider);

        if(isWider) menuburger.removeEventListener("click", switchMenu);
        else menuburger.addEventListener("click", switchMenu);
    },

    scrollTo: (element: Element) => {
        element.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" });
    },

    changeElementText: (element: Element, text: string) => {
        if(element.textContent != text) element.textContent = text;
    },

    temporaryClass: (element: Element, className: string, elementsec?: Element, dlangmain?: string, dlangsec?: string) => {
        element.classList.add(className);
        if(elementsec) elementsec.textContent = globals.retrieveLangText(dlangsec!);

        setTimeout(() => {
            element.classList.remove(className);
            if(elementsec) elementsec.textContent = globals.retrieveLangText(dlangmain!);
        }, 3000);
    },

    changeStorage: (item: string, value: string) => {
        if(localStorage.getItem(item)! != value) localStorage.setItem(item, value);
    },

    hvcode: (code: string) => {
        const shareurl = new URL(path.playground);

        shareurl.searchParams.set("code", code.replace(/\s*;.*/g, ""));

        return shareurl;
    },

    getLang: () => { return Transformer.getInstance().getCurrentLang() },

    getTheme: () => { return localStorage.getItem("theme")! || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") },

    translateElement: (element: Element) => { Transformer.getInstance().updateSingle(element) },

    retrieveLangText: (dlang: string) => { return Transformer.getInstance().getTranslation(dlang) }
}
// -------------------------------------------------------------------------------
Transformer.getInstance().init();
// -------------------------------------------------------------------------------
const root = document.documentElement;
root.setAttribute("data-theme", globals.getTheme());

window.addEventListener("storage", e => {
    if(e.key === "theme") root.setAttribute("data-theme", e.newValue!);
});
// -------------------------------------------------------------------------------
const menuburger = document.querySelector(".burger-menu")!;
const primarymenu = document.querySelector(".primary-menu")!;
// -------------------------------------------------------------------------------
const switchMenu = () => {
    const areVisible = primarymenu.classList.contains("unvisible");

    switchEventsMenu(areVisible);

    globals.switchVisibility(primarymenu, areVisible);
}

const switchEventsMenu = (set: boolean) => {
    if(set) {
        document.addEventListener("click", clickEventMenu);
        document.addEventListener("keydown", escEventMenu);
    }
    else {
        document.removeEventListener("click", clickEventMenu);
        document.removeEventListener("keydown", escEventMenu);
    }
}

const clickEventMenu = (e: MouseEvent) => {
    const element = e.target as Element;
    const notTarget = !menuburger.contains(element) && !primarymenu.contains(element);

    if(notTarget) switchMenu();
}

const escEventMenu = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if(key === "escape") switchMenu();
}
// -------------------------------------------------------------------------------
const path = {
    index: location.origin,
    playground: location.origin + "/pages/playground.html"
}
// -------------------------------------------------------------------------------
const homes = document.querySelectorAll(".home")!;
const cometoplays = document.querySelectorAll(".come-to-play")!;

if(homes) {
    homes.forEach(home => {
        home.setAttribute("href", path.index);
        home.setAttribute("target", "_top");
    });
}

if(cometoplays) {
    cometoplays.forEach(come => {
        come.setAttribute("href", path.playground);
        come.setAttribute("target", "_blank");
    });
}
// -------------------------------------------------------------------------------
const switchtheme = document.querySelector(".switch-theme")!;

if(switchtheme) {
    if(globals.getTheme() != "light") switchtheme.classList.toggle("dark");

    switchtheme.addEventListener("click", () => {
        globals.switchTheme();
        switchtheme.classList.toggle("dark");
    });
}
// -------------------------------------------------------------------------------
const copies = document.querySelectorAll(".copy")!;

if(copies) {
    const commands = document.querySelectorAll(".cmd")!;

    copies.forEach((copy, i) =>
        copy.addEventListener("click", () => {
            const text = commands[i].textContent!;

            try {
                navigator.clipboard.writeText(text);
            }
            catch {
                console.log(text);
            }
            finally {
                globals.temporaryClass(copy, "copied");
            }
        })
    );
}
// -------------------------------------------------------------------------------
const opens = document.querySelectorAll(".open")!;

if(opens) {
    const codes = document.querySelectorAll(".ahv")!;

    opens.forEach((open, i) => {
        const code = globals.hvcode(codes[i].textContent!);

        open.addEventListener("click", () => window.open(code, "_blank"));
    })
}