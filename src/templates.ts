const path = "/templates/";
// ------------------------------------------------------------------------------- 
export default async(tmpl: string) => {
    const element = document.createElement("div");

    const res = await fetch(location.origin + path + tmpl + ".html");
    const html = await res.text();

    element.innerHTML = html.replace(/<script.*\/script>/, "");

    return element.firstElementChild!;
}