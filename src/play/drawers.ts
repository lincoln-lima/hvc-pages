import templates from "../templates";
// ------------------------------------------------------------------------------- 
export default async(gaveteiro: HTMLElement) => {
    for (let i = 0; i < 100; i++) {
        const drawer = await templates('playground/drawer');
        const numdrawer = drawer.childNodes[1].firstChild!;
        numdrawer.textContent = i.toString().padStart(2, "0");
        
        gaveteiro.appendChild(drawer);
    }
}