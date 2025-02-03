import br from "./strings/br.json"
import en from "./strings/en.json"
import es from "./strings/es.json"

export class Transformer {

  private static instance: Transformer | null = null;

  private translations: Record<string, string> = {};
  private currentLang: "en" | "es" | "br" = "en";

  public init() {
    
    this.load(navigator.language);

  }

  private async load(lang: string) {

    try {

      if (lang.includes("en")) {

        this.translations = en;
        this.currentLang = "en";

      } else if (lang.includes("es")) {

        this.translations = es;
        this.currentLang = "es";

      } else if (lang.includes("pt")) {

        this.translations = br;
        this.currentLang = "br";

      }

      this.updateDOM();

    } catch (error) {

      console.error(`Erro ao carregar o idioma: ${lang}`, error);

    }

  }

  public getCurrentLang() {
    return this.currentLang;  
  }

  private getTranslation(key: string, vars: Record<string, string> = {}) {

    let text = this.translations[key] || key;

    for (const [varName, value] of Object.entries(vars)) 
      text = text.replace(`{${varName}}`, value);
    
    return text;

  }

  private updateDOM() {

    document.querySelectorAll("[data-lang]").forEach(dlang => {

      const key = dlang.getAttribute("data-lang");
      
      if (key) 
        dlang.textContent = this.getTranslation(key);

    });
  
  }

  public static getInstance(): Transformer {

    if (!this.instance) {

      this.instance = new Transformer();
      return this.instance;

    } else 
      return this.instance;
    
  }

}