
c = {};

/**
* @namespace Some Common Functions to add JS/CSS-Files or to wait some time
*/
c.core = {
	dataPool: {
		_pool: [],

		set: function(name, data) {
			if (name == 'undefined'){
				console.error("c.core.dataPool: ERROR: name = 'undefined'");
				return;
			}
			this._pool[name] = data;
		},

		get: function(name) {
			if (typeof(this._pool[name]) != "undefined") {
				return this._pool[name];
			}
			return false;
		}
	}
};

c.core.entryStorage = {
	_key: '219374dataStorage23423487',

	set: function(name, data) {
		var obj = c.core.dataPool.get(this._key);
		if (!Array.isArray(obj)) obj = [];
		if (!Array.isArray(obj[name])) obj[name] = [];
		obj[name].push(data);
		c.core.dataPool.set(this._key, obj);
	},

	isSet: function(name, data) {
		var obj = c.core.dataPool.get(this._key);
		if (Array.isArray(obj)) {
			if (Array.isArray(obj[name])) {
				if (obj[name].indexOf(data) >= 0) return true;
			}
		}
		return false;
	}
};

c.core.config = {
	_key: 'lsjli9234coreconfig234k2j342',

	register: function(plugin, callback) {
		var obj = c.core.dataPool.get(this._key)||[];
		if (Array.isArray(obj[plugin]) && typeof callback == 'function'){
			obj[plugin].forEach(function(config){
				callback(config);  // handle configured before registered
			});
		}
		obj[plugin] = callback;
		c.core.dataPool.set(this._key, obj);
	},

	configure: function(plugin, config) {
		var obj = c.core.dataPool.get(this._key)||[];
		if (typeof obj[plugin] == 'function'){
			obj[plugin](config);
			return;
		}
		else
		{
			if (!Array.isArray(obj[plugin]))
				obj[plugin]=[];
			obj[plugin].push(config);
			config = obj[plugin];
		}
		this.register(plugin, config);  //save config for later use
	}
}

c.notify=function(text){
	alert(text);
}
