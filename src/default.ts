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
        menumodal: () => { return document.querySelector(".primary-menu")! },
        menuburger: () => { return document.querySelector(".burger-menu")! }
    },
    actions: {
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
            globals.actions.changeStorage("theme", theme);
        },

        switchMenu: () => {
            const menu = globals.elements.menumodal();
            globals.actions.switchVisibility(menu, menu.classList.contains("unvisible"));
        },

        clickEventMenu: (e: MouseEvent) => {
            const element = e.target as Element;
            const menu = globals.elements.menumodal();
            const burger = globals.elements.menuburger();

            const notTarget = !element.isSameNode(menu) && !element.isSameNode(burger) && !menu.contains(element);

            if(notTarget) {
                const areVisible = !menu.classList.contains("unvisible") && !burger.classList.contains("undisplayed");

                if(areVisible) globals.actions.switchMenu();
            }
        },

        escEventMenu: (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const menu = globals.elements.menumodal();
            const burger = globals.elements.menuburger();

            if(key === "escape") {
                const areVisible = !menu.classList.contains("unvisible") && !burger.classList.contains("undisplayed");

                if(areVisible) globals.actions.switchMenu();
            }
        },

        monitoreMenu: (size: number) => {
            const burger = globals.elements.menuburger();

            if (window.innerWidth > size) {
                globals.actions.switchDisplay(burger, false);
                globals.actions.switchVisibility(globals.elements.menumodal(), true);

                document.removeEventListener("click", globals.actions.clickEventMenu);
                document.removeEventListener("keydown", globals.actions.escEventMenu);

                globals.elements.menuburger().removeEventListener("click", globals.actions.switchMenu);
            }
            else {
                globals.actions.switchDisplay(burger, true);
                globals.actions.switchVisibility(globals.elements.menumodal(), false);

                document.addEventListener("click", globals.actions.clickEventMenu);
                document.addEventListener("keydown", globals.actions.escEventMenu);

                globals.elements.menuburger().addEventListener("click", globals.actions.switchMenu);
            }
        },

        scrollTo: (element: Element) => {
            element.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" });
        },

        changeElementText: (element: Element, text: string) => {
            if(element.textContent != text) element.textContent = text;
        },

        temporaryClass: (element: Element, className: string, elementsec?: Element, dlangmain?: string, dlangsec?: string) => {
            element.classList.add(className);
            if(elementsec) elementsec.textContent = globals.actions.retrieveLangText(dlangsec!);

            setTimeout(() => {
                element.classList.remove(className);
                if(elementsec) elementsec.textContent = globals.actions.retrieveLangText(dlangmain!);
            }, 3000);
        },

        changeStorage: (item: string, value: string) => {
            if(localStorage.getItem(item)! != value) localStorage.setItem(item, value);
        },

        hvcode: (code: string) => {
            const shareurl = new URL(globals.path.playground);

            shareurl.searchParams.set("code", code.replace(/\s*;.*/g, ""));

            return shareurl;
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
window.addEventListener("storage", e => {
    if(e.key === "theme") root.setAttribute("data-theme", e.newValue!);
});
// -------------------------------------------------------------------------------
const homes = document.querySelectorAll(".home")!;
const cometoplays = document.querySelectorAll(".come-to-play")!;

if(homes) {
    homes.forEach(home => {
        home.setAttribute("href", globals.path.index);
        home.setAttribute("target", "_top");
    });
}

if(cometoplays) {
    cometoplays.forEach(come => {
        come.setAttribute("href", globals.path.playground);
        come.setAttribute("target", "_blank");
    });
}
// -------------------------------------------------------------------------------
const switchtheme = document.querySelector(".switch-theme")!;

if(switchtheme) {
    if(globals.actions.getTheme() != "light") switchtheme.classList.toggle("dark");

    switchtheme.addEventListener("click", () => {
        globals.actions.switchTheme();
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
                globals.actions.temporaryClass(copy, "copied");
            }
        })
    );
}
// -------------------------------------------------------------------------------
const opens = document.querySelectorAll(".open")!;

if(opens) {
    const codes = document.querySelectorAll(".ahv")!;

    opens.forEach((open, i) => {
        const code = globals.actions.hvcode(codes[i].textContent!);

        open.addEventListener("click", () => window.open(code, "_blank"));
    })
}