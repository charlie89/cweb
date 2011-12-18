/**
 * @namespace Adds the structure for the page. Includes Functions to display objects.
 */
c.index = {
   /**
    * @namespace Includes functions to add viewers and generate views
    */
   view: {
      choosed: '',
      viewers: new Array(),
      dataPool: new Array(),

      /**
       * Adds a new viewer
       * Obj:
       * name: Name of the viewer
       * func: Function of the viewer which generates the HTML
       * icon: Path to an Icon
       */
      addViewer: function (obj) {
         // set first one as choosed
         if (this.viewers.length == 0) {
            this.choosed = obj.name;
         }
         var o = new Object();
         o.name = obj.name;
         o.func = obj.func;
         this.viewers.push(o);

         // add Button to button-chooser
         var html = $("<img src='" + obj.icon + "' alt='" + obj.name + "'>").click(function () {
            c.index.view.choosed = obj.name;
            c.index.view.regenerate();
         });
         $('#menu-modern-top #view').append(html);
      },

      /**
       * Returns the HTML of the specified viewer.
       * Obj:
       * data: The data to parse
       * html: the div in which the obj should be displayed, just the css-selector, no $()
       * func: onclick-function
       */
      generate: function (o) {
         if (this.viewers.length == 0) {
            alert('No Viewer installed.');
            return '';
         }
         // check if html-target is available
         // otherwise this could be an old entry and will be deleted
         var remove = false;
         if (!$(o.html)) {
            remove = true;
         }
         // check if new or existing object
         var add = true;
         for (var i = 0; i < this.dataPool.length; i++) {
            if (this.dataPool[i].html == o.html) {
               if (remove) { // remove element
                  this.dataPool.splice(i, 1);
                  return '';
               }
               else { // update element
                  add = false;
                  this.dataPool[i] = o;
                  break;
               }
            }
         }
         if (add) this.dataPool.push(o);
         // choose a viewer
         var x = 0;
         for (var i = 0; i < this.viewers.length; i++) {
            if (this.viewers[i].name == this.choosed) {
               x = i;
               break;
            }
         }
         // generate html with the choosen viewer
         return this.viewers[x].func(o);
      },

      /**
       * Regenerates all views with the choosen viewer
       */
      regenerate: function () {
         var length = this.dataPool.length;
         for (var i = 0; i < length; i++) { // on i<this.datapool.length a infinite loop occurs
            c.index.appendMainData(this.dataPool[i]);
         }
      },

      /**
       * Sets the preffered Viewer ('icons' or 'list')
       */
      setPreferredViewer: function (str) {
         this.choosed = str;
      }
   },
   /**
    * Adds a button to the main c.index.
    * id: ID of the button
    * label: Label (text) of the button
    * js: the JS-File to load on click
    */
   addMenuEntry: function (obj) {
      $('#menu-modern-left #main-menu').append($('<li>').attr({
         id: 'c.index.' + obj.plugin
      }).addClass('ui-widget-content').
      append($('<label>').html(obj.label)).click(function () {
         // remove selected-class from all buttons
         var s = $('#menu-modern-left #main-menu li');
         $(s).removeClass('ui-selected');
         $(s).find('div').remove();
         // set selected-class to pressed button
         $(this).addClass('ui-selected').append($('<div>').
         addClass('corn-left').append($('<div>').addClass('corn-left-white')));
         // add JS File
         c.plugin.load(obj.plugin);
      }));
   },

   /**
    * Replaces the content of the main-view with the given HTML
    */
   addMainPage: function (obj) {
      // remove html and all handlers
      //          this.view.deleteDataPool();
      $('#main').empty().append(obj);
   },

   /**
    * Replaces the given html of the given jQuery-Object
    */
   appendMainPage: function (obj, html) {
      if (html == null) {
         $('#main').append(obj);
      }
      else {
         $(html).empty().append(obj);
      }
   },

   /**
    * Adds the given HTML to a div in the bottom of the page which can be hidden
    * INFO: Only dummy at the moment, adds html to the mainpage
    */
   addSecondaryPage: function (obj) {
      this.addMainPage(obj);
      // TODO: Add 2nd menu panel
   },

   /**
    * The given obj is somehow presented, depending on the choosen viewer.
    * obj: some data
    * html: the div where the data should be presented (or null for the main body)
    * viewer: 'icons' or 'list', this is just a recommendation
    */
   appendMainData: function (o) {
      this.appendMainPage(this.view.generate(o), $(o.html));
   }
};


//    c.Common.addJSFile('plugins/main.modern/js/notify.js');  // TODO: Refactor Namespaces
// top bar with search box
var html = "<header id='menu-modern-top'>";
html += "<div id='title'>cWEB - HTML5</div>";
html += "<div id='view'></div>";
html += "</header>";
$('body').append($(html));

// left menu
html = $('<navi>').attr({
   id: 'menu-modern-left'
}).
append($('<ul>').attr({
   id: 'main-menu'
}));
$('body').append(html);

html = $('<section>').attr({
   id: 'main'
});
$('body').append(html);

// register config
c.core.config.register('index-menu', function (config) {
   c.index.addMenuEntry(config);
});