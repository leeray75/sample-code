(function(){
	"use strict";
    define("shopByAppPage/collections/ImagesCollection", 
		["require","shopByAppPage/models/ImageModel"], 
		function(require,ImageModel) {
			var ImagesCollection = Backbone.Collection.extend({ 
				model: ImageModel
			});
			return ImagesCollection;
    	});
})();