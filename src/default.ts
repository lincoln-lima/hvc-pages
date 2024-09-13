import "/src/styles/defaults/header.scss";
// ------------------------------------------------------------------------------- 
export const globals = {
    elements: {
        menumodal: () => { return document.getElementsByTagName("menu")[0]! },
        menuburger: () => { return document.getElementsByClassName("botao-menu")[0]! as HTMLElement },
    },
    actions: {
        displayElement: (element: HTMLElement) => {
            element.style.display = 'revert-layer';
        },
    
        undisplayElement: (element: HTMLElement) => {
            element.style.display = "none";
        },
        
        switchDisplay: (element: HTMLElement, set: boolean) => {
            if(set) globals.actions.displayElement(element);
            else globals.actions.undisplayElement(element);
        },

        showElement: (element: HTMLElement, visible: boolean) => {
           element.style.visibility = visible ? 'visible' : 'hidden'; 
        },
    
        scrollTo: (element: HTMLElement) => {
            element.scrollIntoView({ inline: "center" });
        },
        
        viewMenu: (set: boolean) => {
            const menu = globals.elements.menumodal();

            if(set) {
                menu.style.opacity = '1';
                menu.style.visibility = "visible";
            }
            else {
                menu.style.opacity = '0';
                menu.style.visibility = "hidden";
            }
        },

        monitoreMenu: (size: number) => {
            const burger = globals.elements.menuburger();

            if (window.innerWidth > size) {
                globals.actions.viewMenu(true);
                globals.actions.undisplayElement(burger);
            }
            else {
                globals.actions.viewMenu(false);
                globals.actions.displayElement(burger);
            }
        },
    
        switchMenu: () => {
            const menu = globals.elements.menumodal();
            globals.actions.viewMenu(menu.style.visibility == "hidden");
        }
    }
}
// ------------------------------------------------------------------------------- 
globals.elements.menuburger().addEventListener('click', globals.actions.switchMenu);
// ------------------------------------------------------------------------------- 
window.addEventListener('click', e => {
    const element = e.target as Node;
    const burgerblock = globals.elements.menuburger().style.display != "none";
    const modalvisible = globals.elements.menumodal().style.visibility == "visible";

    if(burgerblock && modalvisible && !globals.elements.menuburger().contains(element)) globals.actions.viewMenu(false);
})