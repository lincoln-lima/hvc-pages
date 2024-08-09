import { globals } from "./global";

export default () => {
    globals.import.addEventListener('click', importahv);
    globals.export.addEventListener('click', exportahv);

    document.addEventListener('keydown', (e) => {
        let key = e.key.toLocaleLowerCase();

        if (key === "s" && e.ctrlKey) {
            e.preventDefault();
            exportahv();
        }
    })

    function importahv() {
        const inputElement = document.createElement('input');
        inputElement.id = 'file';
        inputElement.type = 'file';
        inputElement.style.display = 'none';

        document.body.appendChild(inputElement);
        inputElement.click();

        inputElement.addEventListener("change", async () => {
            const [file] = inputElement.files!;

            if (file) {
                if (file.size <= 1024) globals.setCode(await file.text());
                else alert("Os scripts deverão possuir no máximo 1KB");
            }
        });

        document.body.removeChild(inputElement);
    }

    function exportahv() {
        const blob = new Blob([globals.getCode()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.download = "main";
        link.href = url;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}