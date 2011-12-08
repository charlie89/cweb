/* 
* Shows a form where new links can be inserted.
* All inserted Links are shown.
*/
$(function(){
	if ( typeof Links === "undefined") 
	{
		Links={};
	}

	/**
	* @namespace Reading List/Bookmarks for the web.
	*/
	Links.crawler={
		show:function(){
			var html = "<div id='links-crawler' class='container_12'>";
			html += "<div><div class='grid_1'><label>Name</label></div><div class='grid_11'><input class='grid_11' id='name'></div></div>";
			html += "<label class='grid_1'>URL</label><div class='grid_11'><input class='grid_11' id='url'></div>"; 
			html += "<label class='grid_1'>Tags</label><div class='grid_11'><input class='grid_11' id='tags'></div>";
			html += "<div class='grid_1'></div><div class='grid_4'><button class='grid_4'>Hinzufügen</button></div>";
			html += "</div>";
			var jqhtml = $(html);
			jqhtml.find('button').click(function(){
				var data = {
						name: $('#links-crawler #name').val(),
						url: $('#links-crawler #url').val(),
						tags: $('#links-crawler #tags').val(),
						date: new Date()
				};
				$.ajax({
					type: "POST",
					url: "db/links.crawler",
					data: JSON.stringify(data),
					dataType: "text",
					success: function(e) {
						if (e=="OK") {
							Links.crawler.load();
						}
						else{
							c.notify("Link adding failed.");
						}
					},
					error: function() {
						c.notify('Server unavailable.');
					}
				});
			}); 
			var b =($('<div>').attr({
				id: 'links-crawler-list'
			}));
			c.index.addMainPage(jqhtml);
			c.index.appendMainPage(b);
			c.index.view.setPreferredViewer('list');

			Links.crawler.load();
		}, 

		load:function(){
			$.ajax({
				type: "GET",
				url: "db/links.crawler",
				dataType: "json",
				success: function(e) {
					if (!e.state) {
						c.index.appendMainData({
							data:e, 
							html:'#links-crawler-list',
							click:function(obj){
								window.open(obj['url']);
							},
							items:['name', 'tags', 'date']
						});
					}
					else{
						c.notify("Link adding failed.");
					}
				},
				error: function() {
					c.notify('Server unavailable.');
				}
			});
		}
	};

	c.plugin.register("links.crawler", function() {
		Links.crawler.show();
	});
});
