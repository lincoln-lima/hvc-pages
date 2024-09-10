import global from "./global";
// ------------------------------------------------------------------------------- 
const globals = await global();
// ------------------------------------------------------------------------------- 
export default () => {
    for (let i = 0; i < globals.numgavs; i++) {
        const drawer = document.createElement("article");
        drawer.className = "gaveta";

        const numdrawer = document.createElement("span");
        numdrawer.innerText = i.toString().padStart(2, "0");
        numdrawer.className = "num-gaveta";
        
        const div_numdrawer = document.createElement("div");
        div_numdrawer.appendChild(numdrawer);

        const contdrawer = document.createElement("span");
        contdrawer.className = "cont-gaveta";

        const div_contdrawer = document.createElement("div");
        div_contdrawer.appendChild(contdrawer);

        drawer.appendChild(div_numdrawer);
        drawer.appendChild(div_contdrawer);

        globals.gaveteiro.appendChild(drawer);
    }
}