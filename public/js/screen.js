window.addEventListener('resize', monitoreWindow);
window.addEventListener('load', monitoreWindow);

function monitoreWindow() {
    const menu = document.getElementById("menu");
    const botao_menu = document.getElementsByClassName("botao-menu")[0];

    let size = -Infinity;
    let page = window.location.pathname.split('/').pop().split('.html').shift(); //recuperando nome da página

    if(page === 'index') size = 1064;
    else if(page === 'playground') size = 939;

    if(window.innerWidth > size) {
       menu.style.opacity = '1';
       menu.style.visibility = "visible";

       botao_menu.style.display = "none";
    }
    else {
       menu.style.opacity = '0';
       menu.style.visibility = "hidden";

       botao_menu.style.display = "block";
    }

    //menu.style.opacity = window.innerWidth > size ? 1 : 0;
    //menu.style.visibility = window.innerWidth > size ? "visible" : "hidden";
}