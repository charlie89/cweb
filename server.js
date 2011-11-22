require("cSettings").init(process.env['app_config'], function(cSettings){
	var http = require("http");
	var cRouter = require('cRouter');
	var session = require('cSession');

	var router = cRouter.route([
		{ // Create a new router
			api: 'favicon.ico',
			method: 'GET',
		callback: require('cFile').staticFile(__dirname + '/client/favicon.ico', 'image/x-icon')			
		}
		,{
			api: 'image',
			method: 'GET', 
			callback: function(req, res){
				req.cURL.pathname += '.svg';
				require('cFile').staticDir(__dirname + "/client/core/img", {
					".png": "image/png",
					".jpg": "image/jpeg",
					".jpeg": "image/jpeg",
					".gif": "image/gif",
					".svg": require('mime').lookup('.svg') 
				})(req, res);
			}
		}
		//,{		// enable for file webserver
			//api: 'html',
			//method: 'GET',
			//callback: require('cFile').staticDir(__dirname,{ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'mime/json', '.mp3': 'audio/mp3'})
		//}
	]);

	router.add(require("cindex-page").route);
	router.add(require("cFile").route);
	var cpluginloader = require("cPluginLoader");
	cpluginloader.init();
	router.add(cpluginloader.route);
	router.add(require("cDB").route);

	http.createServer(
		function(req, res){	
			session(req, res, 
				router);
		}
	).listen(cSettings.env.port);

	console.log("Server running at localhost:" + cSettings.env.port + (cSettings.debug? " debug": " release"));

}); 
