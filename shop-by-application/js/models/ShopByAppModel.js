(function(){
	"use strict";
	define("shopByAppPage/models/ShopByAppModel",
	[
		"require",
		"shopByAppPage/models/ExploraModel",
		"shopByAppPage/models/CategoriesModel",
	],
	function(require, ExploraModel, CategoriesModel){
		
		var ShopByAppModel = Backbone.Model.extend(
		{
			defaults: {
				explora: null,
				category: null,
			},
			initialize: function(data){
				var exploraModel;
				if(data.explora.hasOwnProperty('status') && data.explora.status.toLowerCase()=="error"){
					exploraModel = null;
				}
				else{
					exploraModel = new ExploraModel(data.explora);
				}
				var categoriesModel = new CategoriesModel(data.categories);
				this.set('explora',exploraModel);
				this.set('category',categoriesModel);
			}
		});


		return ShopByAppModel;
	
	});
})();