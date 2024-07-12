/* definindo elemento seção*/
const secs = document.getElementById("gaveteiro");

for (let i = 0; i < 100; i++) {
    /* adicionando elemento div para agrupar imagem e span */
    const article = document.createElement("article");
    article.className = "gaveta";
    secs.appendChild(article);

/*     /* criando gaveta 
    const imagem = document.createElement("img");
    imagem.src = "img/gaveteiro.png"; */

    /* criando número da gaveta */
    const num_gaveta = document.createElement("span");

    /* passando para string e descobrir a quantidade de dígitos */
    /* caso tamanho seja 1, adicionar o 0 */
    num_gaveta.innerText = i.toString().length === 1 ? '0' + i : i;
    num_gaveta.id = "num-gaveta-" + i;
    num_gaveta.className = "num-gaveta texto";

    const cont_gaveta = document.createElement("span");
    /* cont_gaveta.innerText = "---"; */
    cont_gaveta.id = "cont-gaveta-" + i;
    cont_gaveta.className = "cont-gaveta texto";

    // article.appendChild(imagem);
    article.appendChild(document.createElement("div"));
    article.appendChild(num_gaveta);
    article.appendChild(cont_gaveta);
}