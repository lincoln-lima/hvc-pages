import { actions } from "../playground";
// ------------------------------------------------------------------------------- 
export default () => {
    const importbutton = document.getElementById("import")!;
    const exportbutton = document.getElementById("export")!;

    const importahv = () => {
        const inputelement = document.createElement("input");

        inputelement.id = "file";
        inputelement.type = "file";
        inputelement.style["display"] = "none";

        document.body.appendChild(inputelement);
        inputelement.click();

        inputelement.addEventListener("change", async () => {
            const [file] = inputelement.files!;

            if(file) {
                if (file.size <= 1024) actions.setCode(await file.text());
                else alert("Os scripts deverão possuir no máximo 1KB");
            }
        });

        document.body.removeChild(inputelement);
    }

    const exportahv = () => {
        const blob = new Blob([actions.getCode()], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "main";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    // ------------------------------------------------------------------------------- 
    importbutton.addEventListener("click", importahv);
    exportbutton.addEventListener("click", exportahv);
}