$(function(){
	tododata = 
	{
		item: ko.observableArray( 
			[
				{labe: ko.observable('Beschreibung'),
					val: ko.observable('Hallo')
				}, 
				{labe: 'Wichtigkeiit'}
		])
	};
	function todo(){
		c.index.addMainPage($("#formAccept").html());
		ko.applyBindings(tododata);

		// observable object is modifiable through; tododata.item()[0].val('Servus');
	}	

	c.plugin.register("todo", todo);
});
