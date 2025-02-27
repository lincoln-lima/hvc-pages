import pt from "./strings/pt.json";
import en from "./strings/en.json";
import es from "./strings/es.json";
// ---------------------------------------------------------------------------
export class Transformer {
    private static instance: Transformer | null = null;

    private translations: Record<string, string> = {};
    private currentLang: "en" | "es" | "pt" = "en";

    public init() {
        const urlParams = new URLSearchParams(window.location.search);
        const langInUrl = urlParams.get("lang");

        if(langInUrl) this.load(langInUrl);
        else this.load(navigator.language);
    }

    private async load(lang: string) {
        try {
            if(lang.includes("en")) {
                this.translations = en;
                this.currentLang = "en";
            }
            else if(lang.includes("es")) {
                this.translations = es;
                this.currentLang = "es";
            }
            else if(lang.includes("pt")) {
                this.translations = pt;
                this.currentLang = "pt";
            }

            this.updateDOM();
            this.updateUrl(lang);
        }
        catch (error) {
            console.error(`Erro ao carregar o idioma: ${lang}`, error);
        }
    }

    private updateDOM() {
        document.querySelectorAll("[data-lang]").forEach(dlang => this.updateTextElement(dlang));
    }

    public updateSingle(element: Element) {
        element.querySelectorAll("[data-lang]").forEach(dlang => this.updateTextElement(dlang));
    }
    
    private updateTextElement(element: Element) {
        const key = element.getAttribute("data-lang");

        if(key) element.textContent = this.getTranslation(key);
    }

    private updateUrl(lang: string) {
        const url = new URL(window.location.href);

        url.searchParams.set("lang", lang);
        window.history.pushState({}, "", url.toString());
    }

    public getCurrentLang() {
        return this.currentLang;
    }

    public getTranslation(key: string, vars: Record<string, string> = {}) {
        let text = this.translations[key] || "lang-" + key;

        for (const [varName, value] of Object.entries(vars)) text = text.replace(`{${varName}}`, value);

        return text;
    }

    public static getInstance(): Transformer {
        if(!this.instance) this.instance = new Transformer();
        
        return this.instance;
    }
}