(function () {
    var textarea = document.getElementById('editor');
    var cm = CodeMirror.fromTextArea(textarea, {
        content: "This is Spartaaaa",
        height: "512px",
        mode: 'javascript',
        autoMatchParens: true,
        textWrapping: true,
        lineNumbers: true,
        matchBrackets: true,
        tabMode: 'spaces',
        indentUnit: 4
    });
})();