# cWEB
This is a free, modern, extendable website built on top of node.js.

This project actually contains 2 projects:

*   the server-side application
*   the client-side website

These 2 interact through self written APIs.

## Information
This Software is NOT for production. It is in heavy development and not everything works or is implemented at the moment. Please wait until v1.0 is released.

## Server
### Optimizations
The server has several ways to optimize the website in speed:

*   all stylesheets and javascripts are cached, so they are only read once from HDD
*   before caching, the stylesheets and javascripts are minified to make the size smaller
*   the index page is cached and will be gzipped before sending it to a client
*   every client-side plugin can be loaded through an API (content also gzipped)

### Features
*   Serve static files
*   Analyze and optimize the website (see optimizations)
*   Session Support on every request. If someone isnt logged on, the login-site is displayed
*   User-enabled plugins (to enable some plugins only to some users)

### APIs
These APIs are used from the website

*   /file: Handle files (example: /file/delete/local/textfile.txt to delete a file)
*   /image: serves images from the images directory
*   /cPluginLoader: Load plugins

A full documented list of APIs will be published until v1.0 is ready.

## Client
The webpage was originally my personal website with PHP on the server side.

### Features
*   Modern Interface (if you dont like the style, edit the stylesheet to your needs)
*   Support for many Plugins
*   selectable Viewers to display some data with different tables/dataGrids (without reloading the data)

### Plugins
At the moment there are not many plugins available because some functions of the main interface are under heavy change. This will change after publishing v1.0.
The following plugins are available:

*   menu.staticmenu: A simple menu
*   editor.codemirror: Codemirror plugin to edit text files
*   modaldialog.simplemodal: Overlay-dialog
*   view.icons: Display some data with an icon-based view
*   view.list: Display some data with an list-based view
*   filebrowser: Browse files from your local disk or a php server and view, rename, move, delete or upload files

The following plugins will be soon available:

*   Bookmarks: Save bookmarks, search, edit and open them

# License
This project is released under the GNU GPLv3.