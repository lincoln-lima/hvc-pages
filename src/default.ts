import "/src/styles/fonts.scss";
import "/src/styles/defaults/style.scss";
import "/src/styles/defaults/header.scss";
// ------------------------------------------------------------------------------- 
export const globals = {
    elements: {
        menumodal: () => { return document.getElementsByTagName("menu")[0]! },
        menuburger: () => { return document.getElementsByClassName("botao-menu")[0]! as HTMLElement },
    },
    actions: {
        displayElement: (element: HTMLElement) => {
            element.style.display = "revert-layer";
        },
    
        undisplayElement: (element: HTMLElement) => {
            element.style.display = "none";
        },
        
        switchDisplay: (element: HTMLElement, set: boolean) => {
            if(set) globals.actions.displayElement(element);
            else globals.actions.undisplayElement(element);
        },
    
        scrollTo: (element: HTMLElement) => {
            element.scrollIntoView({ inline: "center" });
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
    
        switchMenu: () => {
            const menu = globals.elements.menumodal();
            globals.actions.switchVisibility(menu, menu.style['visibility'] == "hidden");
        }
    }
}
// ------------------------------------------------------------------------------- 
globals.elements.menuburger().addEventListener('click', globals.actions.switchMenu);
// ------------------------------------------------------------------------------- 
window.addEventListener('click', e => {
    const element = e.target as Node;
    const menu = globals.elements.menumodal();
    const burgerblock = globals.elements.menuburger().style.display != "none";
    const modalvisible = globals.elements.menumodal().style.visibility == "visible";

    if(burgerblock && modalvisible && !globals.elements.menuburger().contains(element)) globals.actions.switchVisibility(menu, false);
})