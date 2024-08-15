export const table = async () => {
    const res = await fetch(`/templates/table.html`);

    return await res.text();
}