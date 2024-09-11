export const table = async () => {
    const res = await fetch(`/templates/table.html`);
    const html = await res.text();

    const table = document.createElement("table");
    table.innerHTML = html;

    return table;
}

export const footer = async () => {
    const res = await fetch(`/templates/footer.html`);
    const html = await res.text();

    const footer = document.createElement("footer");
    footer.innerHTML = html;

    return footer;
}

export const configs = async () => {
    const res = await fetch(`/templates/modals/configs.html`);
    const html = await res.text();

    const configs = document.createElement("section");
    configs.innerHTML = html;
    configs.id = "config-modal"
    configs.className = "mymodal"

    return configs;
}

export const card = async () => {
    const res = await fetch(`/templates/modals/card.html`);
    const html = await res.text();

    const card = document.createElement("section");
    card.innerHTML = html;
    card.id = "cartao-modal"
    card.className = "mymodal"

    return card;
}