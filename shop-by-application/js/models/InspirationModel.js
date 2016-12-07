(function(){
	"use strict";
	define("shopByAppPage/models/InspirationModel",
	[
		"require",
		"shopByAppPage/collections/ImagesCollection",
	],
	function(require,ImagesCollection){
		var _InspirationModel = Backbone.Model.extend(
		{
			defaults: {
				images: []
			},
			initialize: function(data){
				var images;
				if(data.hasOwnProperty("images") && $.isArray(data.images) && data.images.length>0){
					images = new ImagesCollection(data.images);
					images.reset(images.shuffle());
				}
				else{
					images = new ImagesCollection();
				}
				this.set("images",images);
			}
		});
	
		return _InspirationModel;
	
	});
})();
