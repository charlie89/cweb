/* @version 1.1 fixedMenu
 * @author Lucas Forchino
 * @webSite: http://www.jqueryload.com
 * jquery top fixed menu
 */
(function ($) {
   $.fn.fixedMenu = function () {
      return this.each(function () {
         var menu = $(this);
         menu.find('ul li > a').bind('click', function () {
            if ($(this).parent().hasClass('active')) {
               $(this).parent().removeClass('active');
            }
            else {
               $(this).parent().parent().find('.active').removeClass('active');
               $(this).parent().addClass('active');
            }
         })
      });
   }
})(jQuery);


/**
 * @namespace Generates a Menu
 */
c.menu = function (menu, dom) {
   if (!menu) return;
   var html = "<div class='menu-fixedmenu'>";
   html += '<ul>';
   for (var i = 0; i < menu.length; i++) {
      html += "<li><span>";
      html += menu[i].text;
      html += "</span></li>";
   }
   html += "</ul></div>";
   var jhtml = $(html);
   var i = 0;
   jhtml.find('li').each(function (i) {
      if (menu[i].func) $(this).click(function () {
         // get data of selected elements
         var e = [];
         $('.view-icons-content .ui-selected').each(function () {
            e[e.length] = $(this).data();
         })
         if (e.length == 0) { // take first if none found (
            e = $('.view-icons-content li:first').data();
         }
         menu[i - 1].func(e);
      });
      i++;
   }).fixedMenu();

   if (dom) c.index.appendMainPage(jhtml, dom);
   else return jhtml;
};