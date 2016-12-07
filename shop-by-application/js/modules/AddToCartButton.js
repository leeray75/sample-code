(function () {
	"use strict";
     define("shopByAppPage/modules/AddToCartButton",[
	 	"require"
		],
		function(require) {
			var AddToCartButton = Backbone.Marionette.ItemView.extend({
				tagName: 'div',
				className: 'add-to-cart-button clearfix',
				template: BH.utils.templates.get("ShopByApp.modules.AddToCartButton"),
				templateHelpers: function () {
					var model = this.model;
					return {
						getAtcFormAction: function(){
							return BH.constants.baseUrl+'home?O='+BH.globals.currPageName+'&A=cart&Q=add';
						},
						getAtcButtonLabel: function(){
							if(model.get("showPreOrder")){
								return "Preorder";
							}
							else{
								return "Add to Cart";
							}
						},
						getCartLink: function(){
							return BH.constants.findUrl+'cart.jsp';
						}
					}
				},
				initialize: function(options){
					if(options.hasOwnProperty('ci')){
						this.model.set("categoryId",options.ci);
					}
				},
				modelEvents: {
					"change:inCart": "render"
				},
				onRender: function(){
					var itemModel = this.model;
					var itemCreateModel = itemModel.getItemCreateModel();
					this.$el.data('itemdata',itemCreateModel.toJSON());
					this.$el.one('item-in-cart',function(e){
						itemModel.set("inCart",true);
					});
					BH.Item.create(this.$el);
				}
			});

			return AddToCartButton;
    }); 
})();