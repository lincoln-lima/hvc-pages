import { globals } from "./global";

export default () => {
    for (let i = 0; i < globals.numgavs; i++) {
        const article = document.createElement("article");
        article.className = "gaveta";

        const numdrawer = document.createElement("span");
        numdrawer.innerText = i.toString().padStart(2, "0");
        numdrawer.className = "num-gaveta mono";

        const cont_gaveta = document.createElement("span");
        cont_gaveta.className = "cont-gaveta mono";

        article.appendChild(document.createElement("div"));
        article.appendChild(numdrawer);
        article.appendChild(cont_gaveta);

        globals.gaveteiro.appendChild(article);
    }
}