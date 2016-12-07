(function(){
	"use strict";
    define("shopByAppPage/collections/ProductItemsCollection", 
		["require","shopByAppPage/models/ProductItemModel"], 
		function(require,ProductItemModel) {
			var ProductItemsCollection = Backbone.Collection.extend({ 
				model: ProductItemModel
			});
			return ProductItemsCollection;
    	});
})();