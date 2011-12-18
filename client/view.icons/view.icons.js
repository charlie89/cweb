/*
 * Adds a viewer to the main menu
 */

$(function () {
   c.index.view.addViewer({
      name: 'icons',

      func: function (obj) {
         // generate html for data
         var html = $('<ul>').addClass('view-icons');

         // add data
         for (var r = 0; r < obj.data.length; r++) {
            var row = obj.data[r];
            row.header = obj.head; // append head to all elements
            var entry = $('<li>').data(row).append($('<img>').attr({
               src: row['image']
            })).append($('<label>').html(row['name'])).attr('unselectable', 'on');

            // handle some style options
            if (obj.style) {
               if (obj.style.option == 'selectable') entry.dblclick(function () { // need double-click on selectable components
                  obj.click($(this).data());
                  $(this).removeClass('ui-selected').find('img').attr({
                     src: 'client/common/css/img/loading/loading_animation.gif'
                  });
               }).click(function () {
                  $(this).toggleClass('ui-selected');
               });
            }
            else {
               entry.click(function () {
                  obj.click($(this).data());
               });
            }
            html.append(entry);
         }
         // add main content
         var box = $('<div>').addClass('view-icons-content').append(html);
         // add head
         if (obj.head) box = box.before($('<div>').addClass('view-icons-head').append($('<label>').html("Path: " + obj.head.path)));
         // add menu
         if (c.menu) box = box.before(c.menu(obj.menu));

         return box;

         // some functions to generate html

         function _generateDropDown() {}

      },

      icon: 'image/actions/view-list-icons'
   });
});