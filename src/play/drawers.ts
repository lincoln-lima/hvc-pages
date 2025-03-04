import templates from "../templates";
// ------------------------------------------------------------------------------- 
const template = await templates("playground/drawer");

export default (gaveteiro: Element) => {
    for (let i = 0; i < 100; i++) {
        const drawer = template.cloneNode(true) as Element;
        const num = drawer.querySelector(".num-drawer")!;

        num.textContent = i.toString().padStart(2, "0");

        gaveteiro.appendChild(drawer);
    }
}