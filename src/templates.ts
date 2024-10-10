const path = '/templates/';

export default async(tmpl: string) => {
    const res = await fetch(location.origin + path + tmpl + '.html');
    const element = document.createElement('div');
    
    element.innerHTML = await res.text();

    return element.childNodes[2] as HTMLElement;
}