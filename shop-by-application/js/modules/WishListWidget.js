(function () {
	"use strict";
     define("shopByAppPage/modules/WishListWidget",[
	 	"require",
		"shopByAppPage/collections/ProductItemsCollection"
		],
		function(require,ProductItemsCollection) {
			var buildWishlistTimeout = null;
			var WishListModel = Backbone.Model.extend({
				default: {
					"ownerLastName":"",
					"isPublic":true,
					"type":"Public",
					"date":"",
					"id":"",
					"shipping":{},
					"items":[],
					"isDefault":true,
					"subTotal":"",
					"isListOwner":true,
					"name":"",
					"wishDate":"",
					"ownerFirstName":"",
					"itemCount":0,
					"displayId": 0
				},
				constructor: function(data){
					data.items = new ProductItemsCollection(data.items);
					Backbone.Model.prototype.constructor.call(this, data);
				}
			});
			
			var WishListsCollection = Backbone.Collection.extend({ 
				model: WishListModel,
				getItemWishListIds: function(item){
					var sku = item.get("sku");
					var wishlistIds = []
					this.each(function(wishList){
						var items = wishList.get("items");
						if(items.get(sku) != null){
							wishlistIds.push(wishList.get('id'));	
						}
					});
					return wishlistIds;
				}
			});
			
			var wishLists = new WishListsCollection([]);
			$(document).on('WISHLIST-UPDATED',function(e,data){
				wishLists.reset(data.wishlists);
			});
			
			var WishListWidget = Backbone.Marionette.ItemView.extend({
				tagName: 'div',
				className: 'wish-list-widget js-item clearfix',
				template: BH.utils.templates.get("ShopByApp.modules.WishListWidget"),
				templateHelpers: function () {
					var model = this.model;
					return {
						getFormAction: function(){
							return BH.constants.baseUrl+'home?O='+BH.globals.currPageName+'&A=addItemToWishList&Q=';
						}
					}
				},
				initialize: function(options){},
				onRender: function(){
					var itemModel = this.model;
					var thisView = this;
					
					var buildWishlist = function(itemCreateModel, wishlistIds){
						itemCreateModel.set("li",wishlistIds);
						itemCreateModel.set("inWish",wishlistIds.length>0);
						thisView.$el.data('itemdata',itemCreateModel.toJSON());
						if(wishlistIds.length>0){
							thisView.$el.find('.item-not-in-any-list').hide();
							thisView.$el.find('.item-in-some-list').show();
						}
					}
					
					var itemCreateModel = itemModel.getItemCreateModel();
					var wishlistIds = wishLists.getItemWishListIds(itemModel);
					buildWishlist(itemCreateModel, wishlistIds);
					clearTimeout(buildWishlistTimeout);
					buildWishlistTimeout = setTimeout(function(){
						$(document).trigger('REBUILD_WISHLIST');
					},500);
					
					this.$el.on('item-in-wishlist',function(e){
						var wishlistIds = [];
						this.$el.find('.wishlist-link.item-in-list').each(function(index,wishlistEl){
							var $link = $(wishlistEl);
							wishlistIds.push($link.data('id'));
						});
						itemCreateModel = itemModel.getItemCreateModel();
						buildWishlist(itemCreateModel, wishlistIds);
						$(document).click();
					}.bind(this));
					
					wishLists.on('change reset add',function(e){
						clearTimeout(buildWishlistTimeout);
						itemCreateModel = itemModel.getItemCreateModel();
						var wishlistIds = wishLists.getItemWishListIds(itemModel);
						buildWishlist(itemCreateModel, wishlistIds);
						// wait for all items to update before rebuilding all the wishlists
						buildWishlistTimeout = setTimeout(function(){
							$(document).trigger('REBUILD_WISHLIST');
						},500);
						
					}.bind(this));
				}
				
			});

			return WishListWidget;
    }); 
})();