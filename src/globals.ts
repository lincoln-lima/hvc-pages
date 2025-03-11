import { Transformer } from "./lang/Transformer";
// -------------------------------------------------------------------------------
export const root = document.documentElement;

export const path = {
    index: location.origin,
    playground: location.origin + "/pages/playground.html"
}
// -------------------------------------------------------------------------------
export const menuburger = document.querySelector(".burger-menu")!;
export const primarymenu = document.querySelector(".primary-menu")!;
// -------------------------------------------------------------------------------
export const switchDisplay = (element: Element, set?: boolean) => {
    element.classList.toggle("undisplayed", !(set ?? element.classList.contains("undisplayed")));
}

export const switchVisibility = (element: Element, set?: boolean) => {
    element.classList.toggle("unvisible", !(set ?? element.classList.contains("unvisible")));
}

export const switchTheme = () => {
    const theme = root.getAttribute("data-theme") != "dark" ? "dark" : "light";

    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

export const monitoreMenu = (size: number) => {
    const isWider = window.innerWidth > size;

    switchEventsMenu(false);

    switchDisplay(menuburger, !isWider);
    switchVisibility(primarymenu, isWider);

    if (isWider) menuburger.removeEventListener("click", switchMenu);
    else menuburger.addEventListener("click", switchMenu);
}

export const scrollTo = (element: Element) => {
    element.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" });
}

export const changeElementText = (element: Element, text: string) => {
    if (element.textContent != text) element.textContent = text;
}

export const temporaryClass = (element: Element, className: string, elementsec?: Element, dlangmain?: string, dlangsec?: string) => {
    element.classList.add(className);
    if (elementsec) elementsec.textContent = retrieveLangText(dlangsec!);

    setTimeout(() => {
        element.classList.remove(className);
        if (elementsec) elementsec.textContent = retrieveLangText(dlangmain!);
    }, 3000);
}

export const hvcode = (code: string) => {
    const shareurl = new URL(path.playground);

    shareurl.searchParams.set("code", code.replace(/\s*;.*/g, ""));

    return shareurl;
}

export const getLang = () => { return Transformer.getInstance().getCurrentLang() }

export const getTheme = () => { return localStorage.getItem("theme")! || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") }

export const translateElement = (element: Element) => Transformer.getInstance().updateSingle(element)

export const retrieveLangText = (dlang: string) => { return Transformer.getInstance().getTranslation(dlang) }

export const translateDOM = () => Transformer.getInstance().init();
// -------------------------------------------------------------------------------
const switchMenu = () => {
    const areVisible = primarymenu.classList.contains("unvisible");

    switchEventsMenu(areVisible);

    switchVisibility(primarymenu, areVisible);
}

const switchEventsMenu = (set: boolean) => {
    if (set) {
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

    if (notTarget) switchMenu();
}

const escEventMenu = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if (key === "escape") switchMenu();
}