$(function(){
    /**
     * @namespace Opens the Item with the standard Viewer/Editor
     */
    c.open=function(path, mimetype){
        if (mimetype.search("text")>=0){
            c.edit(path, ['save', 'format', 'undo', 'redo']);
        }
        else
        {
            window.open(window.location+path);
        }
    };
});