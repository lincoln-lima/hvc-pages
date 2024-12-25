import { play } from "../playground";
// ------------------------------------------------------------------------------- 
export default () => {
    const importahv = () => {
        const inputelement = document.createElement("input");

        inputelement.id = "file";
        inputelement.type = "file";
        inputelement.style["display"] = "none";

        document.body.appendChild(inputelement);
        inputelement.click();

        inputelement.addEventListener("change", async () => {
            const [file] = inputelement.files!;

            if (file) {
                if (file.size <= 1024) play.actions.setCode(await file.text());
                else alert("Os scripts deverão possuir no máximo 1KB");
            }
        });

        document.body.removeChild(inputelement);
    }

    const exportahv = () => {
        const blob = new Blob([play.actions.getCode()], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.download = "main";
        link.href = url;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    // ------------------------------------------------------------------------------- 
    play.elements.import().addEventListener("click", importahv);
    play.elements.export().addEventListener("click", exportahv);
    // ------------------------------------------------------------------------------- 
    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();

        if(e.ctrlKey) {
            if (key === "s") {
                e.preventDefault();
                exportahv();
            }
            else if (key === "i") {
                e.preventDefault();
                importahv();
            }
        }
    });
}