require("cSettings").init(process.env['app_config'], function(cSettings){
	var http = require("http");
	var cRouter = require('cRouter');
	var mongo = require('mongoskin');
	var db = mongo.db(cSettings.db.mongolab.url);

	var dataPool = {
		_pool: [],

		set: function(name, data) {
			if (name === 'undefined') {
				console.error("dataPool: ERROR: name = 'undefined'");
				return;
			}
			this._pool[name] = data;
		},

		get: function(name) { 
			if (typeof(this._pool[name]) !== "undefined") {
				return this._pool[name];
			}
			return false;
		}
	};

	// auto log in on development
	// needs: 'debug name pw' as command line args
	if (cSettings.debug === true) {
		tryLogin(null, null, cSettings.debugConf.autoLogin.name, cSettings.debugConf.autoLogin.pw);	
	}

	var router = cRouter.route([
		{ // Create a new router
			api: 'favicon.ico',
			method: 'GET',
			callback: require('cFile').staticFile(__dirname + '/client/favicon.ico', 'image/x-icon')			
		}
		,{
			api: 'image',
			method: 'GET', 
			callback: require('cFile').staticDir(__dirname + "/client/core/img", {
				".png": "image/png",
				".jpg": "image/jpeg",
				".jpeg": "image/jpeg",
				".gif": "image/gif"
			})
		}
		,{		// enable for file webserver
			api: 'html',
			method: 'GET',
			callback: require('cFile').staticDir(__dirname,{ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'mime/json', '.mp3': 'audio/mp3'})
		}
	]);

	router.add(require("cindex-page").route);
	router.add(require("cFile").route);
	var cpluginloader = require("cPluginLoader");
	cpluginloader.init();
	router.add(cpluginloader.route);
	router.add(require("cDB").route);

		http.createServer(
			function(req, res) {
					// auto log in on development
					if ((cSettings.debug === true) && (req.session.data.user === 'Guest')) {
						req.session.data.user = cSettings.debugConf.autoLogin.name;
					}
					// get user data
					req.user = dataPool.get(req.session.data.user);
					req.cSettings = cSettings;
					req.db = db;
					if (!req.user){
						if (require("url").parse(req.url).pathname !== "/login") {
							res.writeHead(307, {
								'Location': "/login"
							});
							res.end();
						} else {
							// check name and pw
							var query = require("url").parse(req.url, true).query;
							if (typeof query.name !== 'undefined') {
								tryLogin(req, res, query.name, query.pw);
							} else {
								require("fs").readFile(__dirname + '/client/views/login.html', function(err, data) {
									if (err) throw err;
									res.end(data);
								});
							}
						}
					} else {
						router(req, res);
					}
			}).listen(cSettings.env.port);
			console.log("Server running at localhost:" + cSettings.env.port + cSettings.debug);
			function tryLogin(req, res, name, pw) {
				console.log("try logging in: " + name);
				db.collection('users').findOne({
					'name': name
				}, function(err, user) {
					if (err || (user.pw !== pw)) {
						console.log("Login failed: " + name + "@" + pw + " err:" + JSON.stringify(err));
						if (res) res.end("ERROR");
					}
					else {
						user.id = user._id + '';  //make id to string, otherwise filtering for it fails
						dataPool.set(name, user);
						if (req) req.session.data.user = name;	// needed for sesh
						console.log("Login success: " + name);
						if (res) res.end("OK");
					}
				});
			}
}); 
