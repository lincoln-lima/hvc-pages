import { Transformer } from "./lang/Transformer";
// ------------------------------------------------------------------------------- 
import "/src/styles/fonts.scss";
import "/src/styles/defaults/style.scss";
import "/src/styles/defaults/header.scss";
// ------------------------------------------------------------------------------- 
export const globals = {
    path: {
        index: location.origin,
        playground: location.origin + "/pages/playground.html"
    },
    elements: {
        menumodal: () => { return document.getElementsByClassName("primary-menu").item(0)! as HTMLElement },
        menuburger: () => { return document.getElementsByClassName("burger-menu").item(0)! as HTMLElement }
    },
    actions: {
        displayElement: (element: HTMLElement) => {
            if(element.style["display"] != "revert-layer") element.style["display"] = "revert-layer";
        },
    
        undisplayElement: (element: HTMLElement) => {
            if(element.style["display"] != "none") element.style.setProperty("display", "none", "important");
        },
        
        switchDisplay: (element: HTMLElement, set: boolean) => {
            if(set) globals.actions.displayElement(element);
            else globals.actions.undisplayElement(element);
        },
        
        switchVisibility: (element: HTMLElement, set: boolean) => {
            if(set) {
                element.style["visibility"] = "visible";
                element.style["opacity"] = "1";
            }
            else {
                element.style["opacity"] = "0";
                element.style["visibility"] = "hidden";
            }
        },
        
        switchMenu: () => {
            const menu = globals.elements.menumodal();
            globals.actions.switchVisibility(menu, menu.style["visibility"] != "visible");
        },

        switchTheme: () => {
            const theme = root.getAttribute("data-theme") != "dark" ? "dark" : "light";
            
            root.setAttribute("data-theme", theme);
            globals.actions.changeStorage("theme", theme);
        },
        
        monitoreMenu: (size: number) => {
            const burger = globals.elements.menuburger();

            if (window.innerWidth > size) {
                globals.actions.switchVisibility(globals.elements.menumodal(), true);
                globals.actions.undisplayElement(burger);
            }
            else {
                globals.actions.displayElement(burger);
                globals.actions.switchVisibility(globals.elements.menumodal(), false);
            }
        },
        
        scrollTo: (element: Element) => {
            element.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" });
        },

        changeElementText: (element: Element, text: string) => {
            if(element.textContent != text) element.textContent = text;
        },

        changeElementClass: (element: Element, className: string) => {
            if(element.className != className) element.className = className;
        },

        changeStorage: (item: string, value: string) => {
            if(localStorage.getItem(item)! != value) localStorage.setItem(item, value);
        },

        hvcode: (code: string) => { 
            const shareurl = new URL(globals.path.playground);
            
            shareurl.searchParams.set("code", code.replace(/\s*;.*/g, ""));

            return shareurl.toString();
        },

        getLang: () => { return Transformer.getInstance().getCurrentLang() },

        getTheme: () => { return localStorage.getItem("theme")! || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") },

        translateElement: (element: Element) => { Transformer.getInstance().updateSingle(element) },

        retrieveLangText: (dlang: string) => { return Transformer.getInstance().getTranslation(dlang) }
    }
}
// ------------------------------------------------------------------------------- 
const root = document.documentElement;
// ------------------------------------------------------------------------------- 
Transformer.getInstance().init();
// ------------------------------------------------------------------------------- 
root.setAttribute("data-theme", globals.actions.getTheme());
// ------------------------------------------------------------------------------- 
globals.elements.menuburger().addEventListener("click", globals.actions.switchMenu);
// ------------------------------------------------------------------------------- 
const homes = document.getElementsByClassName("home")!;
const cometoplays = document.getElementsByClassName("come-to-play")!;

if(homes) {
    Array.from(homes).forEach(home => {
        home.setAttribute("href", globals.path.index);
        home.setAttribute("target", "_top");
    });
}

if(cometoplays) {
    Array.from(cometoplays).forEach(come => {
        come.setAttribute("href", globals.path.playground);
        come.setAttribute("target", "_blank");
    });
}
// ------------------------------------------------------------------------------- 
const switchtheme = document.getElementsByClassName("switch-theme").item(0)!;

if(switchtheme) {
    if(globals.actions.getTheme() != "light") switchtheme.classList.toggle("dark");

    switchtheme.addEventListener("click", () => {
        globals.actions.switchTheme();
        switchtheme.classList.toggle("dark");
    });
}
// ------------------------------------------------------------------------------- 
const copies = document.getElementsByClassName("copy")!;

if(copies) {
    const commands = document.getElementsByClassName("cmd")!;

    Array.from(copies).forEach((copy, i) =>
        copy.addEventListener("click", () => {
            const text = commands[i].textContent!;

            try {
                navigator.clipboard.writeText(text);
            }
            catch {
                console.log(text);
            }
            finally {
                copy.classList.add("copied");
                setTimeout(() => copy.classList.remove("copied"), 3000);
            }
        })
    );
}
// ------------------------------------------------------------------------------- 
const opens = document.getElementsByClassName("open")!;

if(opens) {
    const codes = document.getElementsByClassName("ahv")!;

    Array.from(opens).forEach((open, i) => {
        const code = globals.actions.hvcode(codes[i].textContent!);

        open.addEventListener("click", () => window.open(code, "_blank"));
    })
}
// ------------------------------------------------------------------------------- 
window.addEventListener("storage", e => {
    if(e.key === "theme") root.setAttribute("data-theme", e.newValue!);
});
// ------------------------------------------------------------------------------- 
document.addEventListener("click", e => {
    const element = e.target as Element;
    const menu = globals.elements.menumodal();
    const burger = globals.elements.menuburger();

    const notTarget = element != menu && element != burger && !menu.contains(element);

    if(notTarget) {
        const areVisible = menu.style["visibility"] != "hidden" && burger.style["display"] != "none";

        if(areVisible) globals.actions.switchMenu();
    }
});

document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    const menu = globals.elements.menumodal();
    const burger = globals.elements.menuburger();

    if(key === "escape") {
        const areVisible = menu.style["visibility"] != "hidden" && burger.style["display"] != "none";
        
        if(areVisible) globals.actions.switchMenu();
    }
});