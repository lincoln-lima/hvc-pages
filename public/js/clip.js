function copyCode(id) {
    let copyText = document.getElementById(id).innerHTML;

    navigator.clipboard.writeText(copyText);

    alert("Copiado para área de transferência:\n" + copyText);
}