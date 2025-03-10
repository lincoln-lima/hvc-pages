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

        let langInUrl = urlParams.get("lang");

        if (!langInUrl && document.referrer) {
            const referrerUrl = new URL(document.referrer);
            langInUrl = referrerUrl.searchParams.get("lang")!;
        }

        this.load(langInUrl || navigator.language);
    }

    private async load(lang: string) {
        try {
            if (lang.match(/^en/)) {
                this.translations = en;
                this.currentLang = "en";
            }
            else if (lang.match(/^es/)) {
                this.translations = es;
                this.currentLang = "es";
            }
            else if (lang.match(/^pt/)) {
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
        if (this.currentLang != "pt") document.querySelectorAll("[data-lang]").forEach(dlang => this.updateTextElement(dlang));
    }

    public updateSingle(element: Element) {
        if (this.currentLang != "pt") element.querySelectorAll("[data-lang]").forEach(dlang => this.updateTextElement(dlang));
    }

    private updateTextElement(element: Element) {
        const key = element.getAttribute("data-lang");

        element.textContent = key ? this.getTranslation(key) : "not-informed";
    }

    private updateUrl(lang: string) {
        const url = new URL(window.location.href);

        url.searchParams.set("lang", lang);
        window.history.pushState({}, "", url);
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
        if (!this.instance) this.instance = new Transformer();

        return this.instance;
    }
}