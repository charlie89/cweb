$(function() {
    /**
     * @namespace Opens an editor
     */
    c.edit = function(path, options) {
        this.editor = null;
        p = path;
        this.path = p;
        this.field = null;
        this.text = function() {};
        c.plugin.load('editor.codemirror', function() {
            var html = $('<textarea>').attr({
                id: 'editor-textarea',
                cols: '120',
                rows: '30'
            }).load("/file/load/" + p, function() {
                var field = c.edit.field = $(this);
                //c.edit.text.bind(field.val())(); TODO: bind text with jquery or other
                c.edit.editor = CodeMirror.fromTextArea(field[0], {
                    content: field.val(),
                    height: "512px",
                    mode: 'javascript',
                    autoMatchParens: true,
                    textWrapping: true,
                    lineNumbers: true,
                    tabMode: 'spaces'
                });
            });
            // menu
            var menu = [];
            if ($.inArray('save', options) >= 0) menu[menu.length] = {
                text: 'Save',
                func: function() {
                    c.edit.editor.save();
                    // TODO: Bind local variable to textfield.val()
                    $.ajax({
                        type: "POST",
                        url: '/file/save/' + p,
                        data: c.edit.field.val(),
                        dataType: "json",
                        success: function(e) {
                            if (e.state == "success") {
                                c.notify({
                                    text: 'Saved ' + p
                                });
                            } else {
                                c.notify('Error: ' + e.error.message);
                            }
                        },
                        error: function() {
                            c.notify('Server unavailable.');
                        }
                    });
                }
            };
            if ($.inArray('format', options) >= 0) menu[menu.length] = {
                text: 'Format',
                func: function() {
                    var lineCount = c.edit.editor.lineCount();
                    for (var line = 0; line < lineCount; line++) {
                        c.edit.editor.indentLine(line);
                    }
                }
            };
            if ($.inArray('undo', options) >= 0) menu[menu.length] = {
                text: 'Undo',
                func: function() {
                    c.edit.editor.undo();
                }
            };
            if ($.inArray('redo', options) >= 0) menu[menu.length] = {
                text: 'Redo',
                func: function() {
                    c.edit.editor.redo();
                }
            };
            html = html.before(c.menu(menu));
            c.index.addMainPage(html);
        });
    };
});