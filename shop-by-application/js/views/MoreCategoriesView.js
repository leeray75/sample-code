(function () {
	"use strict";
     define("shopByAppPage/views/MoreCategoriesView",[
	 	"require",
		"Services",
		"shopByAppPage/helpers"
		],
		function(require,Services,helpers,ProductItemsCollection) {
			BH.utils.templates.add("ShopByApp.MoreCategoriesView", '<h2>More <%= getPageCategoryName() %> Essentials</h2><div class="categories-container"><ul class="more-categories-items clearfix"></ul></div>');
			BH.utils.templates.add("ShopByApp.MoreCategories.CategoryItemView", '<a href="<%- getLink() %>" class="overlay-on-hover"><span class="image-container"><img src="" data-src="<%- getImageSrc() %>"></span><span class="category-name"><%= getCategoryName() %></span></a>');
			
			var _CategoryItemView =  Backbone.Marionette.ItemView.extend({
				tagName: 'li',
				className: 'category-item-view clearfix',
				template: BH.utils.templates.get("ShopByApp.MoreCategories.CategoryItemView"),
				templateHelpers: function () {
					var model = this.model;
					return {
						getCategoryName: function(){
							return model.get("name");
						},
						getImageSrc: function(){
							return model.getImageSrc();
						},
						getLink: function(){
							return model.get("shareUrl");	
						}
					}
				},
				collectionEvents:{
					"reset":"doReset"
				},
				initialize: function(options){},
				onRender: function(){}
			});
			
			var MoreCategoriesView = Backbone.Marionette.CompositeView.extend({
				id: 'more-categories-view',
				className: 'new-page-width clearfix',
				childView: _CategoryItemView,
				childViewContainer: '.more-categories-items',
				template: BH.utils.templates.get("ShopByApp.MoreCategoriesView"),
				templateHelpers: function(){
					var model = this.model;
					return{
						getPageCategoryName: function(){
							return model.get("catAltName");
						}
					}
				},
				initialize: function(options){},
				onRender: function(){
					if(this.collection.length==0){
						this.$el.hide();
					}
					else{
						this.$el.show();
						setTimeout(function(){
							this.$el.find("img").unveil();
						}.bind(this),0);	
					}
				}
			});
			
			return MoreCategoriesView;
    }); 
})();