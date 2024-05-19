/* definindo elemento article */
const article = document.getElementById("article-secs-gaveteiro");

for (let i = 0; i < 100; i++) {
    /* adicionando elemento div para agrupar imagem e span */
    const container = document.createElement("div");
    container.className = "div-article-secs-gaveteiro";
    article.appendChild(container);

    /* criando gaveta */
    const imagem = document.createElement("img");
    imagem.src = "img/gaveteiro.png";

    /* criando número da gaveta */
    const num_gaveta = document.createElement("span");

    /* passando para string e descobrir a quantidade de dígitos */
    /* caso tamanho seja 1, adicionar o 0 */
    num_gaveta.innerText = i.toString().length === 1 ? '0' + i : i;
    num_gaveta.className = "texto"

    container.appendChild(imagem);
    container.appendChild(num_gaveta);
}