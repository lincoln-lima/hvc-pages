const path = "/templates/";
// ------------------------------------------------------------------------------- 
export default async(tmpl: string) => {
    const res = await fetch(location.origin + path + tmpl + ".html");
    const element = document.createElement("div");
    const html = await res.text();

    element.innerHTML = html.replace(/<script.*\/script>/, "");

    return element.children[0] as HTMLElement;
}