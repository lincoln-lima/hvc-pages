import { globals } from "./global";

export default () => {
    /* definindo elemento seção*/
    for (let i = 0; i < globals.numgavs; i++) {
        /* adicionando elemento div para agrupar imagem e span */
        const article = document.createElement("article");
        article.className = "gaveta";

        /* criando número da gaveta */
        const num_gaveta = document.createElement("span");

        /* passando para string e descobrir a quantidade de dígitos */
        /* caso tamanho seja 1, adicionar o 0 */
        num_gaveta.innerText = i.toString().length === 1 ? '0' + i.toString() : i.toString();
        num_gaveta.id = "num-gaveta-" + i;
        num_gaveta.className = "num-gaveta mono";

        const cont_gaveta = document.createElement("span");

        cont_gaveta.id = "cont-gaveta-" + i;
        cont_gaveta.className = "cont-gaveta mono";

        article.appendChild(document.createElement("div"));
        article.appendChild(num_gaveta);
        article.appendChild(cont_gaveta);

        globals.gaveteiro.appendChild(article);
    }
}