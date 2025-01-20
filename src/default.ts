import "/src/styles/fonts.scss";
import "/src/styles/defaults/style.scss";
import "/src/styles/defaults/modal.scss";
import "/src/styles/defaults/header.scss";
import "/src/styles/defaults/darkmode.scss";
// ------------------------------------------------------------------------------- 
export const globals = {
    elements: {
        menumodal: () => { return document.getElementsByClassName("primary-menu")[0]! as HTMLElement },
        menuburger: () => { return document.getElementsByClassName("burger-menu")[0]! as HTMLElement }
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
            element.scrollIntoView({behavior: "smooth", inline: "center", block: "center" });
        },

        changeElementText: (element: Element, text: string) => {
            if(element.textContent != text) element.textContent = text;
        },

        changeElementClass: (element: Element, className: string) => {
            if(element.className != className) element.className = className;
        },

        changeStorage: (item: string, value: string) => {
            if(localStorage.getItem(item)! != value) localStorage.setItem(item, value);
        }
    }
}
// ------------------------------------------------------------------------------- 
globals.elements.menuburger().addEventListener("click", globals.actions.switchMenu);
// ------------------------------------------------------------------------------- 
const switchtheme = document.getElementsByClassName("switch-theme")[0]!;

if(switchtheme) {
    let actualtheme = localStorage.getItem("theme-content") ? localStorage.getItem("theme-content")! : "light"; 
    // ---------------------------------------------------------------------------
    const switchTheme = (oldtheme: string) => {
        switchtheme.classList.replace(oldtheme, actualtheme);
        globals.actions.changeElementClass(document.body, actualtheme + "mode");
    }

    const oldTheme = (newtheme: string) => {
        return newtheme != "light" ? "light" : "dark";
    }
    // ---------------------------------------------------------------------------
    switchTheme(oldTheme(actualtheme));
    // ---------------------------------------------------------------------------
    switchtheme.addEventListener("click", () => {
        actualtheme = switchtheme.classList.contains("light") ? "dark" : "light"; 

        globals.actions.changeStorage("theme-content", actualtheme);
        switchTheme(oldTheme(actualtheme));
    });
    
    window.addEventListener("storage", () => {
        if (actualtheme != localStorage.getItem("theme-content")!) {
            actualtheme = localStorage.getItem("theme-content")!;
            
            switchTheme(oldTheme(actualtheme));
        }
    });
}
// ------------------------------------------------------------------------------- 
const copies = document.getElementsByClassName("copy")!;

if(copies) {
    const commands = document.getElementsByClassName("cmd")!;

    Array.from(copies).forEach((copy, i) =>
        copy.addEventListener("click", () => {
            copy.classList.add("copied");
            
            setTimeout(() => copy.classList.remove("copied"), 3000);
            
            navigator.clipboard.writeText(commands[i].textContent!);
        })
    );
}
// ------------------------------------------------------------------------------- 
const opens = document.getElementsByClassName("open")!;

if(opens) {
    const codes = document.getElementsByClassName("ahv")!;

    const param = location.origin + "/pages/playground.html?code=";

    Array.from(opens).forEach((open, i) => {
        const code = codes[i].textContent!.replace(/\s*;.*/g, '').replace(/\n/g, "%0A");

        open.addEventListener("click", () => {
            localStorage.setItem("saved", "false");

            window.open(param + code, "_blank");
        })
    })
}
// ------------------------------------------------------------------------------- 
window.addEventListener("click", e => {
    const element = e.target;
    const menu = globals.elements.menumodal();
    const burger = globals.elements.menuburger();

    const isTarget = element != menu && element != burger;
    const areVisible = menu.style["visibility"] != "hidden" && burger.style["display"] != "none";

    if(isTarget && areVisible) globals.actions.switchMenu();
});
// ------------------------------------------------------------------------------- 
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    const menu = globals.elements.menumodal();
    const burger = globals.elements.menuburger();

    const areVisible = menu.style["visibility"] != "hidden" && burger.style["display"] != "none";
    
    if(key === "escape" && areVisible) globals.actions.switchMenu();
});