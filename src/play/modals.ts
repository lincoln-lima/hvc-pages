import { switchDisplay, translateElement } from "../globals";
// -------------------------------------------------------------------------------
import templates from "../templates";
// -------------------------------------------------------------------------------
const modalsToAdd = ["configs", "card", "error", "help", "rating"];

export default async() => {
    // -------------------------------------------------------------------------------
    await Promise.all(modalsToAdd.map(async modal => {
        const element = await templates("modal/" + modal);
        switchDisplay(element, false)

        translateElement(element);

        document.body.appendChild(element);
    }));
    // -------------------------------------------------------------------------------
    addHelpTable(modal.help());
    // -------------------------------------------------------------------------------
    closeablesModals().forEach(modal => {
        const close = modal.querySelector(".close")!;

        close.addEventListener("click", () => switchDisplay(modal, false));
    })
    // -------------------------------------------------------------------------------
    modalsClickClose().forEach(modal => {
        modal.addEventListener("click", (e) => {
            const element = e.target as Element;

            if (modal.isSameNode(element)) switchDisplay(modal, false);
        })
    })
    // -------------------------------------------------------------------------------
    document.addEventListener("keydown", modalsKeyEvents);
}
// -------------------------------------------------------------------------------
const allModals = () => { return document.querySelectorAll(".mymodal")! }
const closeablesModals = () => { return document.querySelectorAll(".mymodal:has(.close)")! }

const modalsClickClose = () => { return [modal.config(), modal.help()] }
// -------------------------------------------------------------------------------
const addHelpTable = async(parent: Element) => {
    const table = await templates("table");
    translateElement(table);

    parent.querySelector(".modal-body")!.appendChild(table);
}
// -------------------------------------------------------------------------------
export const modalsKeyEvents = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if (!e.ctrlKey) {
        if (key === "f2") {
            e.preventDefault();
            switchDisplay(modal.config());
        }
        else if (key === "f12") {
            e.preventDefault();
            switchDisplay(modal.help());
        }
        else if (key === "escape") hideModals();
    }
}
// -------------------------------------------------------------------------------
export const hideModals = () => {
    allModals().forEach(modal => switchDisplay(modal, false));
}
// -------------------------------------------------------------------------------
export const openModals = (openmodals: [Element, Element][]) => {
    openmodals.forEach(([open, modal]) => {
        open.addEventListener("click", () => switchDisplay(modal, true));
    })
}
// -------------------------------------------------------------------------------
export const modal = {
    help: () => { return document.getElementById("help-modal")! },
    card: () => { return document.getElementById("card-modal")! },
    errors: () => { return document.getElementById("error-modal")! },
    config: () => { return document.getElementById("config-modal")! },
    rating: () => { return document.getElementById("rating-modal")! }
}