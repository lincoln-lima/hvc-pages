function monitoraTelaIndex() {
    menu.style.opacity = window.innerWidth > 1064 ? 1 : 0;
    menu.style.visibility = window.innerWidth > 1064 ? "visible" : "hidden";

    // if(window.innerWidth > 1064) menu.style.transition = "none";
    // menu.style.transition = window.innerWidth > 1064 ? "none" : "0.5s";
}

function monitoraTelaPlayground() {
    menu.style.opacity = window.innerWidth > 939 ? 1 : 0;
    menu.style.visibility = window.innerWidth > 939 ? "visible" : "hidden";

    // if(window.innerWidth > 1064) menu.style.transition = "none";
    // menu.style.transition = window.innerWidth > 1064 ? "none" : "0.5s";
}