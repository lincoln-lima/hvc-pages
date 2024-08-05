import { globals } from "./global";

globals.export.addEventListener('click', exportahv);
globals.import.addEventListener('click', importahv);

function exportahv() {
    const blob = new Blob([globals.getCode()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.download = "main.ahv";
    link.href = url;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

async function importahv() {
    const inputElement = document.createElement('input');
    inputElement.id = 'file';
    inputElement.type = 'file';
    inputElement.style.display = 'none';

    document.body.appendChild(inputElement);

    document.getElementById('file')!.addEventListener('change', (e) => {
        const input = (e.target as HTMLInputElement)!;
        const file = input.files![0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContent = event.target!.result!.toString();

            if (RegExp("[^.ahv]").test(file.name)) {
                globals.setCode(fileContent);

                // HVC.editor.rename(file.name)
            } else alert("Só é permitido o envio de scripts no formato .ahv");
        
            document.getElementById('file')!.remove();
        };

        reader.readAsText(file);
    });

    document.getElementById("file")!.dispatchEvent(new Event("click"));
}