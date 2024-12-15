import { globals } from "./default";
import { getDoc, setDoc } from "./play/codemirror"
// ------------------------------------------------------------------------------- 
import hvc from "./play/hvc";
import drawers from "./play/drawers";
import templates from "./templates";
// ------------------------------------------------------------------------------- 
import "/src/styles/playground/playground.scss";
import "/src/styles/playground/modal.scss";
import "/src/styles/defaults/table.scss";
// ------------------------------------------------------------------------------- 
export const play = {
    elements: {
        out: () => { return document.getElementById("saida-value")! },
        acumulator: () => { return document.getElementById("acumulador-value")! },
        epi: () => { return document.getElementById("epi-value")! },
        readcard: () => { return document.getElementById("card")! as HTMLInputElement },
        
        run: () => { return document.getElementById("run")! },
        debug: () => { return document.getElementById("debug")! },
        import: () => { return document.getElementById("import")! },
        export: () => { return document.getElementById("export")! },

        state: () => { return document.getElementById("states-view")! },

        debugmenu: () => { return document.getElementById("debug-menu")! },

        portacartoes: () => { return document.getElementById("porta-cartoes")! },
        editor: () => { return document.getElementById("editor")! },

        back: () => { return document.getElementById("back")! },
        forth: () => { return document.getElementById("forth")! },
        pausecontinue: () => { return document.getElementById("pause-continue")! },
        finish: () => { return document.getElementById("finish")! },

        configmodal: () => { return document.getElementById("config-modal")! },
        cardmodal: () => { return document.getElementById("card-modal")! },
        errorsmodal: () => { return document.getElementById("error-modal")! },
        helpmodal: () => { return document.getElementById("help-modal")! },
        loadingmodal: () => { return document.getElementById("loading-modal")! },
        ratingmodal: () => { return document.getElementById("rating-modal")! },
    
        configs: () => { return  document.getElementById("config")! },
        saveconfigs: () => { return document.getElementById("save-configs")! },
        closeconfigs: () => { return document.getElementById("close-configs")! },
    
        submitcard: () => { return document.getElementById("submit-card")! },
    
        error: () => { return document.getElementById("error")! },
        closeerrors: () => { return document.getElementById("close-error")! },

        help: () => { return document.getElementById("help")! },
        
        delay: () => { return document.getElementById("delay")! as HTMLInputElement },
        theme: () => { return document.getElementById("theme")! as HTMLSelectElement },
        
        gaveteiro: () => { return document.getElementById("gaveteiro")! },
        scrollgaveteiro: () => { return document.getElementById("scroll-gaveteiro")! },
        drawers: () => { return document.getElementsByClassName("drawer")! },
        drawerscontent: () => { return document.getElementsByClassName("cont-drawer")! },

        scrolltablecards: () => { return document.getElementById("scroll-tablecards")! },
        tablecards: () => { return document.getElementById("cards")! },
        cards: () => { return play.elements.tablecards().children[0]! as HTMLElement },
        
        askrating: () => { return localStorage.getItem("askrating")! },
        closerating: () => { return document.getElementById("close-rating")! },
        ratingstars: () => { return document.getElementById("rating")! },
        counter: () => { return localStorage.getItem("counter")! },
        dontask: () => { return document.getElementById("dont-ask")! }
    },
    actions: {
        setState: (state: string) => {
            let dotclass;
    
            if(state === 'carga') dotclass = 'charging';
            else if(state === 'execução') dotclass = 'running';
            else dotclass = 'editing';
    
            play.elements.state().className = dotclass;
        },
    
        detectError: (message: string) => {
            play.elements.error().innerText = message;
            globals.actions.displayElement(play.elements.errorsmodal());
        },
    
        getCode: () => {
            return getDoc();
        },
        
        setCode: (text: string) => {
            setDoc(text);
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
        }
    }
}
// ------------------------------------------------------------------------------- 
const windowsizemenu = 680;
// ------------------------------------------------------------------------------- 
globals.actions.monitoreMenu(windowsizemenu);
window.addEventListener('resize', () => globals.actions.monitoreMenu(windowsizemenu));
// ------------------------------------------------------------------------------- 
const loadplay = async () => {
    // ------------------------------------------------------------------------------- 
    drawers(play.elements.scrollgaveteiro());
    hvc();
    // ------------------------------------------------------------------------------- 
    play.elements.helpmodal().children[0].appendChild(await templates('table'));
    // ------------------------------------------------------------------------------- 
    play.elements.delay().value = localStorage.getItem("delay-hvc") ? (localStorage.getItem("delay-hvc"))! : '1000';
    play.elements.theme().value = localStorage.getItem("theme-play") ? (localStorage.getItem("theme-play"))! : 'lightmode';
    // ------------------------------------------------------------------------------- 
    document.body.className = play.elements.theme().value;
    // ------------------------------------------------------------------------------- 
    if(!play.elements.askrating() || !play.elements.counter()) {
        localStorage.setItem("askrating", "true");
        localStorage.setItem("counter", "0");
    }
    
    const hideRating = () => {
        globals.actions.undisplayElement(play.elements.ratingmodal());
    }

    const neveraskagain = () => {
        localStorage.setItem("askrating", "false");
        hideRating();
    }
    
    play.elements.closerating().addEventListener("click", hideRating);
    play.elements.ratingstars().addEventListener("click", hideRating);
    play.elements.dontask().addEventListener("click", neveraskagain);
    // ------------------------------------------------------------------------------- 
    play.elements.configs().addEventListener("click", () => globals.actions.displayElement(play.elements.configmodal()));
    play.elements.closeconfigs().addEventListener("click", () => globals.actions.undisplayElement(play.elements.configmodal()));
    play.elements.saveconfigs().addEventListener('click', () => {
        localStorage.setItem("delay-hvc", play.elements.delay().value);
        localStorage.setItem("theme-play", play.elements.theme().value);

        document.body.className = localStorage.getItem("theme-play")!;

        globals.actions.undisplayElement(play.elements.configmodal());
    });
    // ------------------------------------------------------------------------------- 
    document.addEventListener("keydown", e => {
        if(e.key.toLowerCase() === "f2") {
            e.preventDefault();
            const config = play.elements.configmodal();

            globals.actions.switchDisplay(config, config.style['display'] === 'none');
        }
    });

    window.addEventListener("click", e => {
        if(e.target == play.elements.configmodal()) globals.actions.undisplayElement(play.elements.configmodal());
        else if(e.target == play.elements.helpmodal()) switchHelp();
    });
    // ------------------------------------------------------------------------------- 
    play.elements.closeerrors().addEventListener('click', () => globals.actions.undisplayElement(play.elements.errorsmodal()));
    // ------------------------------------------------------------------------------- 
    const switchHelp = () => {
        const element = play.elements.helpmodal();
        const display = element.style['display'] === 'none';
        
        globals.actions.switchDisplay(element, display);

        if(display) globals.actions.undisplayElement(play.elements.help());
        else globals.actions.displayElement(play.elements.help());
    }

    play.elements.help().addEventListener('click', switchHelp);
    document.addEventListener('keydown', e => {
        if(!e.ctrlKey && e.key.toLowerCase() === 'f12') {
            e.preventDefault();
            switchHelp();
        }
    })
}
// ------------------------------------------------------------------------------- 
const modals = ['configs', 'card', 'error', 'help', 'rating'];

modals.forEach(async modal => {
    const element = await templates('modal/' + modal);
    element.style['display'] = 'none';

    document.body.appendChild(element);
});
// ------------------------------------------------------------------------------- 
const tablecards = await templates("playground/cards");

play.elements.scrolltablecards().appendChild(tablecards);
play.elements.scrolltablecards().style['display'] = "none";
// ------------------------------------------------------------------------------- 
setTimeout(async () => await loadplay(), 500);