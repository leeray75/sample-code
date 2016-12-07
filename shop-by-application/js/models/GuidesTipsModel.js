(function(){
	"use strict";
	define("shopByAppPage/models/GuidesTipsModel",
	[
		"require",
		"shopByAppPage/models/ImageModel"
	],
	function(require,ImageModel){
		var BadgeModel = Backbone.Model.extend(
		{
			defaults: {
				value: '',
				color: ''
			},

		});
		
		var ItemModel = Backbone.Model.extend(
		{
			defaults: {
				title: '',
				text: '',
				badge: null,
				image: null,
				videoID: null
			},
			initialize: function(data){
				var _badge = data.hasOwnProperty("badge") ? new BadgeModel(data.badge) : new BadgeModel();
				this.set("badge", _badge);
				
				if(data.hasOwnProperty("image")){
					var _image = new ImageModel(data.image);
					this.set("image",_image);	
				}
			}
		});
		
		var ItemsCollection = Backbone.Collection.extend({ 
			model: ItemModel
		});
		
		var GuidesTipsModel = Backbone.Model.extend(
		{
			defaults: {
				items: []
			},
			initialize: function(data){
				var _items;
				if(data.hasOwnProperty("items") && $.isArray(data.items) && data.items.length>0){
					_items = new ItemsCollection(data.items);
				}
				else{
					_items = new ItemsCollection();
				}
				this.set("items",_items);
			}
		});
	
		return GuidesTipsModel;
	
	});
})();
