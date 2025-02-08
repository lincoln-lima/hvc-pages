import templates from "../templates";
// ------------------------------------------------------------------------------- 
const template = await templates("playground/drawer");

export default (gaveteiro: Element) => {
    for (let i = 0; i < 100; i++) {
        const drawer = template.cloneNode(true) as HTMLElement;
        const num = drawer.getElementsByClassName("num-drawer").item(0)!;

        num.textContent = i.toString().padStart(2, "0");
        
        gaveteiro.appendChild(drawer);
    }
}