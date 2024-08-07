import { globals } from "./global";

window.addEventListener('resize', monitoreWindow);
window.addEventListener('load', monitoreWindow);

function monitoreWindow() {
    let size = -Infinity;
    let page = window.location.pathname.split('/').pop()!.split('.html').shift(); //recuperando nome da página

    if(page === 'index') size = 1064;
    else if(page === 'playground') size = 939;

    if(window.innerWidth > size) {
        globals.menu.style.opacity = '1';
        globals.menu.style.visibility = "visible";

        globals.botao_menu.style.display = "none";
    }
    else {
        globals.menu.style.opacity = '0';
        globals.menu.style.visibility = "hidden";

        globals.botao_menu.style.display = "block";
    }

    // globals.menu.style.opacity = window.innerWidth > size ? 1 : 0;
    // globals.menu.style.visibility = window.innerWidth > size ? "visible" : "hidden";
}