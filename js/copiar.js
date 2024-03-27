function copiarComando(id) {
    var texto = document.getElementById(id);

    texto.select();
    texto.setSelectionRange(0, 99999);

    navigator.clipboard.write(texto.value);

    alert("Copiado para área de transferência");
}