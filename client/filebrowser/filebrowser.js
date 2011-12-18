/**
 * @namespace File-Browser. Includes moving, renaming and deleting files and creating new folders.
 */
filebrowser = {
   path: null,

   show: function () {
      c.index.addMainPage($('<div>').attr({
         id: 'filebrowser'
      }));
      this.load('');
   },

   _click: function (obj) {
      if (obj.isDirectory) {
         this.load(obj.path);
      }
      else {
         //TODO: right-click menu with other opening-actions like edit or download
         c.open('local/' + obj.path, obj.mimeType);
      }
   },

   _menu: [{
      text: 'New Folder',
      func: function (o) {
         var path = "empty";
         if (o.hasOwnProperty('header')) path = o.header.path;
         else if (o[0].hasOwnProperty('header')) path = o[0].header.path;
         var html = $("<div id='filebrowser-newfolder'><p>Create New Folder:</p>" + path + "<input type='text' id='newfoldername' /><button>Create</button></div>");
         html.find('button').button().click(function () {
            $.ajax({
               type: "GET",
               url: "/file/mkdir?path=/" + path + "&name=" + $('#filebrowser-newfolder #newfoldername').val(),
               dataType: "json",
               success: function (e) {
                  if (typeof (e.error) != "undefined") {
                     c.notify("Creating new folder failed: " + e.result);
                     return;
                  }
                  filebrowser.load();
                  c.notify("Created Folder " + e.header.name);
               },
               error: function () {
                  c.notify('Server unavailable.');
               }
            });
            $.modal.close();
         });
         html.modal();
      }
   }, {
      text: 'Upload',
      func: function (o) {
         c.notify("Upload isn't implemented");
      }
   }, {
      text: 'Copy',
      func: function (o) {
         if ((o.length >= 1) && (o[0].header.path)) {
            var path = o[0].header.path;
            var filename = o[0].filename;
            var html = $("<div id='filebrowser-rename'><p>Neuer Dateiname für " + o[0].filename + ":</p><input type='text' id='newfilename' /><button>Umbenennen</button></div>");
            html.find('button').button().click(function () {
               $.ajax({
                  type: "GET",
                  url: "/file/copy?path=" + path + filename + "&newpath=/" + path + "/" + $('#filebrowser-rename #newfilename').val(),
                  dataType: "json",
                  success: function (e) {
                     if (typeof (e.error) != "undefined") {
                        c.notify("Rename failed: " + e.error.message);
                        return;
                     }
                     filebrowser.load();
                     c.notify("Renamed File to " + e.header.name);
                  },
                  error: function () {
                     c.notify('Server unavailable.');
                  }
               });
               $.modal.close();
            });
            html.modal();
         }
      }
   }, {
      text: 'Move',
      func: function (o) {
         if ((o.length >= 1) && (o[0].path)) {
            var files = o[0].filename;
            for (var i = 1; i < o.length; i++)
            files += ', ' + o[i].filename;
            var path = o[0].header.path;
            var move = $("<div id='filebrowser-move'><p>Die Dateien " + files + " in folgenden Ordner verschieben:</p><div id='newfolder'></div><button id='ok'>OK</button><button id='cancel'>Cancel</button></div>");
            move.find('button').button();
            move.find('#ok').click(function () {
               // get selected folder
               var data = $('#newfolder ul li.ui-selected:first').data();
               if (data) var newpath = data.filename;
               if (newpath) for (var i in o)
               $.ajax({
                  type: "GET",
                  url: "/file/move?path=" + path + o[i].filename + "&newpath=/" + path + newpath + "/" + o[i].filename,
                  dataType: "json",
                  success: function (e) {
                     if (typeof (e.error) != "undefined") {
                        c.notify("Moving failed: " + e.error.message);
                        return;
                     }
                     filebrowser.load();
                     c.notify("Moved");
                  },
                  error: function () {
                     alert('Server unavailable.');
                  }
               });
               $.modal.close();
            });
            move.find('#cancel').click(function () {
               $.modal.close();
            })
            move.modal();
            $.ajax({
               type: "GET",
               url: "/file/browse/" + path,
               dataType: "json",
               success: function (e) {
                  $('#newfolder').append($('<ul>'));
                  for (var i in e.content) {
                     if (e.content[i].isDirectory) {
                        $('#newfolder ul').append($('<li>').data(e.content[i]).append(e.content[i].filename));
                     }
                  }
                  $('#newfolder li').click(function () {
                     $('#newfolder li').removeClass('ui-selected').css('list-style-type', 'circle');
                     $(this).addClass('ui-selected').css('list-style-type', 'none');
                  });
               },
               error: function () {
                  alert('Server unavailable.');
               }
            });
         }
      }
   }, {
      text: 'Rename',
      func: function (o) {
         if ((o.length >= 1) && (o[0].header.path)) {
            var path = o[0].header.path;
            var filename = o[0].filename;
            var html = $("<div id='filebrowser-rename'><p>Datei " + o[0].filename + " umbenennen:</p><input type='text' id='newfilename' /><button>Umbenennen</button></div>");
            html.find('button').button().click(function () {
               $.ajax({
                  type: "GET",
                  url: "/file/rename?path=/" + path + "&filename=" + filename + "&newfilename=" + $('#filebrowser-rename #newfilename').val(),
                  dataType: "json",
                  success: function (e) {
                     if (typeof (e.error) != "undefined") {
                        c.notify("Rename failed: " + e.error.message);
                        return;
                     }
                     filebrowser.load();
                     c.notify("Renamed File to " + e.header.name);
                  },
                  error: function () {
                     c.notify('Server unavailable.');
                  }
               });
               $.modal.close();
            });
            html.modal();
         }
      }
   }, {
      text: 'Delete',
      func: function (a) {
         if (a[0].hasOwnProperty('header')) {
            var ask = "Really delete ";
            for (var i in a) {
               ask += a[i].filename + ", ";
            }
            if (confirm(ask.substring(0, ask.length - 2) + "?")) {
               for (var i in a) {
                  $.ajax({ //TODO: Implement c.Common ajax-pool
                     type: "GET",
                     url: "/file/delete?path=/" + a[i].header.path + a[i].filename,
                     dataType: "json",
                     success: function (e) {
                        if (typeof (e.error) != "undefined") {
                           c.notify("Delete failed: " + e.error.message);
                           return;
                        }
                        this.load();
                        c.notify("Deleted File");
                     },
                     error: function () {
                        c.notify('Server unavailable.');
                     }
                  });
               }
               this.load();
            }
         }
      }
   }],

   load: function (path) {
      if (path == null) path = filebrowser.path;
      $.ajax({
         type: "GET",
         url: "/file/app.files/" + path,
         dataType: "json",
         success: function (e) {
            if (typeof e.error == "undefined") {
               // set path
               filebrowser.path = e.header.path;
               // append data to viewer
               c.index.appendMainData({
                  data: e.content,
                  html: '#filebrowser',
                  head: e.header,
                  style: {
                     option: 'selectable'
                  },
                  click: filebrowser._click,
                  menu: filebrowser._menu
               });
            }
            else {
               c.notify("Error: " + e.error.message);
            }
         },
         error: function () {
            c.notify('Server unavailable.');
         }
      });
   }
};

c.plugin.register("filebrowser", function(){
   filebrowser.show();
});