/* botões */
const config_btn = document.getElementById("config-btn");
const fechar = document.getElementById("close");

/* modal */
const configs = document.getElementById("config-modal");

/* funções para mostrar ou ocultar configurações */
function mostraConfig() {
    configs.style.display = "block";
}

function ocultaConfig() {
    configs.style.display = "none";
}

/* evento de click para abrir configurações */
document.addEventListener("keydown", e => {
    if(e.key.toLocaleLowerCase() === "f10") {
        if(!(configs.style.display) || configs.style.display === "none") mostraConfig();
        else ocultaConfig();
    }
});

config_btn.addEventListener("click", mostraConfig);

fechar.addEventListener("click", ocultaConfig);

window.addEventListener("click", function(e) {
    if(e.target == configs) ocultaConfig();
});