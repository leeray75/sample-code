(function () {
	"use strict";
     define("shopByAppPage/views/TopCategoriesView",[
	 	"require",
		"Services",
		"shopByAppPage/helpers",
		"shopByAppPage/collections/ProductItemsCollection",
		"shopByAppPage/modules/AddToCartButton",
		"shopByAppPage/modules/WishListWidget"
		],
		function(require,Services,helpers,ProductItemsCollection,AddToCartButton,WishListWidget) {
			BH.utils.templates.add("ShopByApp.TopCategoriesView", '<div class="top-categories-items"></div>');
			var loadingProducts = [];
			var _ProductItemView = Backbone.Marionette.LayoutView.extend({
				tagName: 'li',
				className: 'product-item-container clearfix',
				template: BH.utils.templates.get("ShopByApp.TopCategories.ProductInfoView"),
				templateHelpers: function () {
					var model = this.model;
					return {
						getImageAlt: function(){
							return this.getProductName();
						},
						getImageSrc: function(){
							return model.getImage();
						},
						getOriginalPrice: function(){
							return "$"+model.get("originalPrice");
						},
						getPrice: function(){
							return "$"+model.get("price");
						},
						getProductName: function(){
							return model.get("brand")+" "+model.get("shortDescription");
						},
						getProductLink: function(){
							return model.get("detailsUrl");
						}
					}
				},
				regions: {
					"AddToCartButton": "[data-region='add-to-cart-button']",
					"WishListWidget": "[data-region='wish-list-widget']"
				},
				initialize: function(options){
					if(options.hasOwnProperty('ci')){
						this.ci = options.ci;
					}
				},
				events:{
					'mouseleave': 'doMouseLeave'
				},
				modelEvents: {},
				onRender: function(){
					var itemModel = this.model;
					var addToCartButton = new AddToCartButton({ model: this.model, ci: this.ci });
					this.getRegion('AddToCartButton').show(addToCartButton);

					var wishListWidget = new WishListWidget({ model: this.model });
					this.getRegion('WishListWidget').show(wishListWidget);

				},
				onDomRefresh: function(){
					this.$el.find('.ellipsis').ellipsis({row: 3});
				},
				doMouseLeave: function(e){
					/* Close wishlist dropdown menu after leaving the item */
					$(document).trigger('click');
				}
			});

			var _CategoryItemView =  Backbone.Marionette.CompositeView.extend({
				childView: _ProductItemView,
				childViewContainer: '.products-list',
				childViewOptions: function(){
					return {
						ci: this.bnhCategoryId
					}
				},
				className: 'category-item-view clearfix',
				template: BH.utils.templates.get("ShopByApp.TopCategories.CategoryItemView"),
				templateHelpers: function () {
					var model = this.model;
					return {
						getCategoryKeys: function(){
							return model.get("categoryKeys");
						},
						getCategoryName: function(){
							return model.get("name");
						},
						getViewAllLink: function(){
							return model.get("shareUrl");	
						}
					}
				},
				initialize: function(options){
					this.collection = new ProductItemsCollection([]);
				},
				onDomRefresh: function(){
					if(this.collection.length==0){
						this.$el.append(BH.utils.svgLoader(100));
						helpers.lazyLoadModule(this).then(this.loadProducts.bind(this));
					}
				},
				onAttach: function(){
					if(this.collection.length==0){
						this.$el.append(BH.utils.svgLoader(100));
						helpers.lazyLoadModule(this).then(this.loadProducts.bind(this));
					}
				},
				onRender: function(){
					var categoryKeys = this.model.get("categoryKeys");
					if(	categoryKeys.length>0 ){
						this.$el.find('.category-keys').removeClass('hidden');
					}
				},
				loadProducts: function(doLoad){
					var thisView = this;
					if(typeof(doLoad) == 'undefined'){
						loadingProducts.push(this);
					}
					var loadNextProduct = function(){
						loadingProducts.shift();
						if(loadingProducts.length>0){
							var prods = loadingProducts[0];
							prods.loadProducts(true);
						}
					}
					var doSuccess = function( data ){
						loadNextProduct();
						thisView.$el.find('svg.circle-loader').remove();
						var items = data.items.slice(0,6);
						thisView.bnhCategoryId = data.bnhCategoryId;
						thisView.collection.reset(items);
					}
					var doError = function(error){
						loadNextProduct();
						thisView.$el.hide();
						$(window).trigger('scroll');
					}
					var nValue = this.model.getNvalue();
					if(doLoad || loadingProducts.length==1){
						Services.getCategoryProducts(nValue).then(doSuccess,doError);	
					}
				}
			});

			var TopCategoriesView = Backbone.Marionette.CollectionView.extend({
				id: 'top-categories-view',
				className: 'new-page-width clearfix',
				childView: _CategoryItemView,
				childViewContainer: '.top-categories-items',
				template: BH.utils.templates.get("ShopByApp.TopCategoriesView"),
				initialize: function(options){},
				collectionEvents:{
					'change': 'render'
				},
				onRender: function(){
					this.$el.find('.category-item-view').each(function(index,el){
						var $el = $(el);
						$el.addClass("category-level-"+(index+1));
					});	
					if(this.collection.length==0){
						this.$el.hide();	
					}
				}
			});
			
			return TopCategoriesView;
    }); 
})();