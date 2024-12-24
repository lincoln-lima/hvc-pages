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
            if(element.style['display'] != 'revert-layer') element.style['display'] = "revert-layer";
        },
    
        undisplayElement: (element: HTMLElement) => {
            if(element.style['display'] != 'none') element.style.setProperty("display", "none", "important");
        },
        
        switchDisplay: (element: HTMLElement, set: boolean) => {
            if(set) globals.actions.displayElement(element);
            else globals.actions.undisplayElement(element);
        },
        
        switchVisibility: (element: HTMLElement, set: boolean) => {
            if(set) {
                element.style['opacity'] = '1';
                element.style['visibility'] = "visible";
            }
            else {
                element.style['opacity'] = '0';
                element.style['visibility'] = "hidden";
            }
        },
        
        switchMenu: () => {
            const menu = globals.elements.menumodal();
            globals.actions.switchVisibility(menu, menu.style['visibility'] == "hidden");
        },
        
        monitoreMenu: (size: number) => {
            const burger = globals.elements.menuburger();

            if (window.innerWidth > size) {
                globals.actions.switchVisibility(globals.elements.menumodal(), true);
                globals.actions.undisplayElement(burger);
            }
            else {
                globals.actions.switchVisibility(globals.elements.menumodal(), false);
                globals.actions.displayElement(burger);
            }
        },
        
        scrollTo: (element: HTMLElement) => {
            element.scrollIntoView({ inline: "center" });
        }
    }
}
// ------------------------------------------------------------------------------- 
const switchtheme = document.getElementsByClassName("switch-theme")[0]! as HTMLElement;

if (switchtheme) {
    let actualtheme = localStorage.getItem("theme-content") ? localStorage.getItem("theme-content")! : "light"; 
    // ---------------------------------------------------------------------------
    const switchTheme = (oldtheme: string) => {
        switchtheme.classList.replace(oldtheme, actualtheme);
        document.body.className = actualtheme + "mode";
    }

    const oldTheme = (newtheme: string) => {
        return newtheme === "light" ? "dark" : "light";
    }
    // ---------------------------------------------------------------------------
    switchTheme(oldTheme(actualtheme));
    // ---------------------------------------------------------------------------
    switchtheme.addEventListener("click", () => {
        actualtheme = switchtheme.classList.contains("light") ? "dark" : "light"; 

        localStorage.setItem("theme-content", actualtheme);
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
globals.elements.menuburger().addEventListener('click', globals.actions.switchMenu);
// ------------------------------------------------------------------------------- 
window.addEventListener('click', e => {
    const element = e.target;
    const menu = globals.elements.menumodal();
    const burger = globals.elements.menuburger();

    const isTarget = element != menu && element != burger;
    const areVisible = menu.style['visibility'] != 'hidden' && burger.style['display'] != 'none';

    if(isTarget && areVisible) globals.actions.switchMenu();
});
// ------------------------------------------------------------------------------- 
document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    const menu = globals.elements.menumodal();
    const burger = globals.elements.menuburger();

    const areVisible = menu.style['visibility'] != 'hidden' && burger.style['display'] != 'none';
    
    if(key === 'escape' && areVisible) globals.actions.switchMenu();
});