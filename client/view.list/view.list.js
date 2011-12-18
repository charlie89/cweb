/*
 * Adds a global function which tries to generate HTML from any data.
 * Uses a table-based design. Good to show entries in a DB or something like that.
 */

/**
 * Generates html-code for a table-based view depending on the given object.
 */
$(function () {
   c.index.view.addViewer({
      name: 'list',

      func: function (obj) {
         var html = $('<table>').attr({
            id: 'view-list'
         });
         // add header row
         var rowhtml = $('<tr>').attr({
            id: 'view-list-head'
         });
         if (obj.items) for (var property in obj.items) {
            try {
               rowhtml.append($('<td>').html(obj.items[property]));
            }
            catch (e) {
               c.notify({
                  text: "view.icons: Item " + property + " not accessible."
               });
            }
         }
         else for (var property in obj.data[0]) {
            rowhtml.append($('<td>').html(property));
         }
         html.append(rowhtml);

         // add data
         for (var r = 0; r < obj.data.length; r++) {
            var row = obj.data[r];
            rowhtml = $('<tr>');
            if (obj.items) for (var property in obj.items) {
               try {
                  rowhtml.append($('<td>').html(row[obj.items[property]]));
               }
               catch (e) {
                  c.notify({
                     text: "view.icons: Item " + property + " not accessible."
                  });
               }
            }
            else for (var property in row) {
               rowhtml.append($('<td>').html(row[property]));
            }
            html.append(rowhtml);
         }

         // append click function
         // doing this in above loop dont works, all get data of the last element
         if (obj.click) {
            var i = 0;
            html.find('tr').each(function (i) {
               $(this).click(function () {
                  obj.click(obj.data[i - 2]); // i-2 is somehow unlogic but it works
               });
               i++;
            });
         }

         // add menu
         if (c.menu) html = html.before(c.menu(obj.menu));

         return html;
      },

      icon: 'image/actions/view-list-compact'
   });
});