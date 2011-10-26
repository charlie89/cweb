c.plugin = {
    _key: '023948plugin23402934',

    load: function(plugins, callback) {
        if (!Array.isArray(plugins)) {
            var help = plugins;
            plugins = [];
            plugins[0] = help;
        }
        plugins.forEach(function(p) {
            if (c.core.entryStorage.isSet(c.plugin._key, p)) {
                var f = c.core.dataPool.get(c.plugin._key + p);
                if (typeof(f) == 'function') f(); //exec registered function when already loaded
                plugins.splice(plugins.indexOf(p), 1);
            }
        });
        if (plugins.length > 0) $.ajax({
            type: "GET",
            url: "/cpluginloader/" + plugins.join('/'),
            dataType: "json",
            success: function(e) {
                if (typeof(e.error) == "undefined") {
                    e.plugins.forEach(function(p) {
                        c.core.entryStorage.set(c.plugin._key, p);
                    });
                    e.css.forEach(function(css) {
                        $('head').append(css);
                    });
                    e.js.forEach(function(js) {
                        $('body').append(js); // when transfered as inline js
                    });
                    c.notify("Loaded Plugins " + e.plugins.toString());
                    if (callback) callback();
                } else {
                    c.notify("Error: " + e.error);
                }
            }
        });
        else if (callback) callback();
    },

    register: function(plugin, func) {
        c.core.dataPool.set(this._key + plugin, func);
		  func();
    }
}
