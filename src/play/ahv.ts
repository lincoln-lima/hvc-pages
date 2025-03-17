import { getCode, setCode } from "../playground";
// ------------------------------------------------------------------------------- 
export default () => {
    const importbutton = document.getElementById("import")!;
    const exportbutton = document.getElementById("export")!;
    const cardholder = document.getElementById("porta-cartoes")!;
    // ------------------------------------------------------------------------------- 
    const importahv = () => {
        const inputelement = document.createElement("input");

        inputelement.id = "file";
        inputelement.type = "file";
        inputelement.style["display"] = "none";

        document.body.appendChild(inputelement);
        inputelement.click();

        inputelement.addEventListener("change", async () => {
            const [file] = inputelement.files!;
            await receiveFile(file);
        });

        document.body.removeChild(inputelement);
    }

    const exportahv = () => {
        const blob = new Blob([getCode()], { type: "text/plain" });
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
    const receiveFile = async(file: File | null) => {
        if (file) {
            if (file.size <= 1024) setCode(await file.text());
            else alert("Os scripts deverão possuir no máximo 1KB");
        }
    }
    // ------------------------------------------------------------------------------- 
    importbutton.addEventListener("click", importahv);
    exportbutton.addEventListener("click", exportahv);
    // ------------------------------------------------------------------------------- 
    cardholder.addEventListener("drop", e => {
        e.preventDefault();
        cardholder.classList.remove("drag");

        const [file] = e.dataTransfer!.files;
        receiveFile(file);
    });

    cardholder.addEventListener("dragover", e => {
        e.preventDefault();
        cardholder.classList.add("drag");
    });

    cardholder.addEventListener("dragleave", e => {
        e.preventDefault();
        cardholder.classList.remove("drag");
    });
}