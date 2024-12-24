import { globals } from "./default";
import { getDoc, setDoc } from "./play/codemirror"
// ------------------------------------------------------------------------------- 
import hvc from "./play/hvc";
import templates from "./templates";
import drawers from "./play/drawers";
// ------------------------------------------------------------------------------- 
import "/src/styles/defaults/table.scss";
import "/src/styles/playground/playground.scss";
// ------------------------------------------------------------------------------- 
export const play = {
    elements: {
        epi: () => { return document.getElementById("epi-value")! },
        out: () => { return document.getElementById("saida-value")! },
        acumulator: () => { return document.getElementById("acumulador-value")! },
        readcard: () => { return document.getElementById("read-card")! as HTMLInputElement },
        
        run: () => { return document.getElementById("run")! },
        debug: () => { return document.getElementById("debug")! },
        import: () => { return document.getElementById("import")! },
        export: () => { return document.getElementById("export")! },

        state: () => { return document.getElementById("states-view")! },
        debugmenu: () => { return document.getElementById("debug-menu")! },

        editor: () => { return document.getElementById("editor")! },
        portacartoes: () => { return document.getElementById("porta-cartoes")! },

        back: () => { return document.getElementById("back")! },
        forth: () => { return document.getElementById("forth")! },
        finish: () => { return document.getElementById("finish")! },
        pausecontinue: () => { return document.getElementById("pause-continue")! },

        helpmodal: () => { return document.getElementById("help-modal")! },
        cardmodal: () => { return document.getElementById("card-modal")! },
        errorsmodal: () => { return document.getElementById("error-modal")! },
        configmodal: () => { return document.getElementById("config-modal")! },
        ratingmodal: () => { return document.getElementById("rating-modal")! },

        modals: () => { return document.getElementsByClassName("mymodal")! },
    
        configs: () => { return document.getElementById("config")! },
        formconfigs: () => { return document.getElementById("configs-form")! },
        closeconfigs: () => { return document.getElementById("close-configs")! },
    
        formcard: () => { return document.getElementById("card-form")! },
    
        error: () => { return document.getElementById("error")! },
        closeerrors: () => { return document.getElementById("close-error")! },

        help: () => { return document.getElementById("help")! },
        
        delay: () => { return document.getElementById("delay")! as HTMLInputElement },
        theme: () => { return document.getElementById("theme")! as HTMLSelectElement },
        
        gaveteiro: () => { return document.getElementById("gaveteiro")! },
        scrollgaveteiro: () => { return document.getElementById("scroll-gaveteiro")! },

        drawers: () => { return document.getElementsByClassName("drawer")! },
        drawerscontent: () => { return document.getElementsByClassName("cont-drawer")! },

        cards: () => { return document.getElementById("cards")! },
        tablecards: () => { return document.getElementById("scroll-tablecards")! },
        
        counter: () => { return localStorage.getItem("counter")! },
        askrating: () => { return localStorage.getItem("askrating")! },
        dontask: () => { return document.getElementById("dont-ask")! },
        ratingstars: () => { return document.getElementById("rating")! },
        closerating: () => { return document.getElementById("close-rating")! }
    },
    actions: {
        getCode: () => {
            return getDoc();
        },
        
        setCode: (text: string) => {
            setDoc(text);
        },

        setState: (state: string) => {
            let dotclass;
    
            if(state === 'carga') dotclass = 'charging';
            else if(state === 'execução') dotclass = 'running';
            else dotclass = 'editing';
    
            play.elements.state().className = dotclass;
        },
    
        showError: (message: string) => {
            play.elements.error().innerText = message;
            globals.actions.displayElement(play.elements.errorsmodal());
        },
    
        highlightDrawer: (drawer: HTMLElement, state: string) => {
            drawer.classList.remove(drawer.classList.item(1)!);
            drawer.classList.add(state);
        },

        switchPauseContinue: () => {
            const actual = play.elements.pausecontinue().className;

            play.elements.pausecontinue().className = actual === 'pause' ? 'continue' : 'pause';
        },

        addCardToTable: (card: string) => {
            const line = document.createElement("tr");
            const data = document.createElement("td");

            data.innerText = card;

            line.appendChild(data);
            play.elements.cards().appendChild(line);
        },

        hideModals: () => {
            Array.from(play.elements.modals()).forEach(modal => {
                const element = modal as HTMLElement;

                if(element != play.elements.cardmodal()) {
                    globals.actions.undisplayElement(element);
                
                    if(element == play.elements.helpmodal()) globals.actions.displayElement(play.elements.help());
                }
            });
        }
    }
}
// ------------------------------------------------------------------------------- 
const windowsizemenu = 680;
// ------------------------------------------------------------------------------- 
document.body.className = localStorage.getItem("theme-play") ? (localStorage.getItem("theme-play"))! : 'lightmode';
// ------------------------------------------------------------------------------- 
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener('resize', () => globals.actions.monitoreMenu(windowsizemenu));
// ------------------------------------------------------------------------------- 
drawers(play.elements.scrollgaveteiro());
// ------------------------------------------------------------------------------- 
if(!play.elements.askrating() || !play.elements.counter()) {
    localStorage.setItem("askrating", "true");
    localStorage.setItem("counter", "0");
}
// ------------------------------------------------------------------------------- 
const modals = ['configs', 'card', 'error', 'help', 'rating'];

modals.forEach(async modal => {
    const element = await templates('modal/' + modal);
    element.style['display'] = 'none';
    
    document.body.appendChild(element);
});
// ------------------------------------------------------------------------------- 
const loadplay = async () => {
    hvc();
    // ---------------------------------------------------------------------------
    play.elements.delay().value = localStorage.getItem("delay-hvc") ? (localStorage.getItem("delay-hvc"))! : '1000';
    play.elements.theme().value = localStorage.getItem("theme-play") ? (localStorage.getItem("theme-play"))! : 'lightmode';
    // ---------------------------------------------------------------------------
    const hideRating = () => {
        globals.actions.undisplayElement(play.elements.ratingmodal());
    }

    const neverAskAgain = () => {
        localStorage.setItem("askrating", "false");
        hideRating();
    }

    const saveConfigs = () => {
        localStorage.setItem("delay-hvc", play.elements.delay().value);
        localStorage.setItem("theme-play", play.elements.theme().value);

        document.body.className = localStorage.getItem("theme-play")!;

        globals.actions.undisplayElement(play.elements.configmodal());
    }

    const switchHelp = () => {
        const button = play.elements.help();
        const modal = play.elements.helpmodal();

        const modaldisplay = modal.style['display'] === 'none';
        const buttondisplay = button.style['display'] === 'none';
        
        globals.actions.switchDisplay(modal, modaldisplay);
        globals.actions.switchDisplay(button, buttondisplay);
    }
    // ---------------------------------------------------------------------------
    play.elements.configs().addEventListener('click', () => globals.actions.displayElement(play.elements.configmodal()));
    play.elements.closeconfigs().addEventListener('click', () => globals.actions.undisplayElement(play.elements.configmodal()));
    play.elements.formconfigs().addEventListener('submit', e => {
        e.preventDefault();
        saveConfigs();
    });

    play.elements.dontask().addEventListener('click', neverAskAgain);
    play.elements.closerating().addEventListener('click', hideRating);
    play.elements.ratingstars().addEventListener('click', hideRating);

    play.elements.help().addEventListener('click', switchHelp);
    play.elements.closeerrors().addEventListener('click', () => globals.actions.undisplayElement(play.elements.errorsmodal()));
    // ---------------------------------------------------------------------------
    window.addEventListener('click', e => {
        if(e.target == play.elements.helpmodal()) switchHelp();
        else if(e.target == play.elements.configmodal()) globals.actions.undisplayElement(play.elements.configmodal());
    });
    // ---------------------------------------------------------------------------
    document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();

        if(!e.ctrlKey) {
            if(key === 'f2') {
                e.preventDefault();
                const config = play.elements.configmodal();

                globals.actions.switchDisplay(config, config.style['display'] === 'none');
            }
            else if(key === 'f12') {
                e.preventDefault();
                switchHelp();
            }
            else if(key === 'escape') play.actions.hideModals();
        }
    });
    // ---------------------------------------------------------------------------
    play.elements.helpmodal().children[0].appendChild(await templates('table'));
}
// ------------------------------------------------------------------------------- 
setTimeout(async () => await loadplay(), modals.length * 100);