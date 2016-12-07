(function () {
	"use strict";
     define("shopByAppPage/views/BestSellersView",[
	 	"require",
		"Services",
		"shopByAppPage/helpers",
		"shopByAppPage/collections/ProductItemsCollection",
		"shopByAppPage/modules/AddToCartButton"
		],
		function(require,Services,helpers,ProductItemsCollection,AddToCartButton) {
			BH.utils.templates.add("ShopByApp.BestSellersView", '<div class="content-container"><h2>Best Sellers</h2><div class="items-container"><ul class="products-list clearfix"></ul></div> <div class="view-all-container"><div class="view-all-button"><span>View All</span></div></div></div>');
			var tooltipTimeout = null;
			var childRenderedTimeout = null;
			var _ProductItemView = Backbone.Marionette.LayoutView.extend({
				tagName: 'li',
				className: 'product-item-container',
				template: BH.utils.templates.get("ShopByApp.BestSellers.ProductInfoView"),
				initialize: function(options){},
				templateHelpers: function () {
					var model = this.model;
					return {
						getConditionalRebatesLink: function(){
							return BH.constants.findUrl+"rebateLayer.jsp/sku/"+model.get("skuNo")+"/is/"+model.get("itemSource")+"/type/cond";
						},
						getFreeItems: function(){
							var freeItems = model.get("includesFree");
							return freeItems.Item;
						},
						getFreeItemsValue: function(){
							var freeItems = model.get("includesFree");
							return freeItems.TotalValue;
						},
						getFreeItemsPopoverContainerClass:function(){
							return "includesFreePop-"+model.cid;
						},
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
						},
						getRegularRebatesLink: function(){
							return BH.constants.findUrl+"rebateLayer.jsp/sku/"+model.get("skuNo")+"/is/"+model.get("itemSource")+"/type/reg";
						},
						getRewardsLink: function(){
							return BH.constants.findUrl+"2percentOff.jsp/percentOff/"+model.get("rewards");
						},
						getSavingsMessage: function(){
							var amount = model.getSavingsAmount();
							return "Save $"+amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" Instantly";
						},
						hasConditionalRebates: function(){
							return model.hasConditionalRebates();
						},
						hasFreeItems: function(){
							var includesFree = model.get("includesFree");
							return includesFree.Item.length>0;
						},
						hasRegularRebates: function(){
							return model.hasRegularRebates();
						},
						hasRewards: function(){
							var rewards = model.get("rewards");
							return rewards.length>0;
						},
						hasSavings: function(){
							return model.getSavingsAmount() > 0;
						}
					}
				},
				regions: {
					"AddToCartButton": "[data-region='add-to-cart-button']"
				},
				onRender: function(){
					var addToCartButton = new AddToCartButton({ model: this.model, ci: helpers.getUrlParamValue(document.location.pathname,"ci") });
					this.getRegion('AddToCartButton').show(addToCartButton);
				},
				onDomRefresh: function(){
					var freeItem = this.model.get("includesFree");
					if(freeItem.Item.length>0){
						clearTimeout(tooltipTimeout);
						tooltipTimeout = setTimeout(function(){
							BH.tooltip.init();
						},500);
					}
				}
			});

			var BestSellersView = Backbone.Marionette.CompositeView.extend({
				id: 'best-sellers-view',
				className: 'new-page-width clearfix',
				childView: _ProductItemView,
				childViewContainer: '.products-list',
				template: BH.utils.templates.get("ShopByApp.BestSellersView"),
				initialize: function(options){
					if(typeof(this.collection)=='undefined'){
						this.collection = new ProductItemsCollection([]);	
					}
				},
				events:{
					"click .view-all-button": "loadProducts"
				},
				collectionEvents:{
					'reset': 'render'
				},
				onRender: function(){
					this.$el.find('.items-container').append(BH.utils.svgLoader(100));
					setTimeout(function(){
						helpers.lazyLoadModule(this).then(this.loadProducts.bind(this));
					}.bind(this),1000);
				},
				addChildTimeout: null,
				onAddChild: function(childView){
					clearTimeout(this.addChildTimeout);
					/* wait for children views to render onto DOM */
					this.addChildTimeout = setTimeout(function(){
						var $itemWrappers = this.$el.find('.item-wrapper:not(.match-height)');
						$itemWrappers.matchHeight();
						$itemWrappers.addClass('match-height');
					}.bind(this),0);
				},
				loadProducts: function(e){
					var thisView = this;
					var itemsPerPage = 8;
					var doSuccess = function( data ){
						if(thisView.collection.length==0){
							this.$el.find('svg.circle-loader').remove();
						}
						thisView.collection.add(data.items);
						if(this.collection.length >= data.resultCount){
							this.$el.find('.view-all-container').hide();
						}
					}
					var doError = function(error){}
					var params = {
						N: 	helpers.getUrlParamValue(document.location.pathname,"N"),
						ci: helpers.getUrlParamValue(document.location.pathname,"ci"),
						ipp: itemsPerPage,
						setIPP: itemsPerPage,
						pn: (thisView.collection.length/itemsPerPage)+1
					}

					Services.getBestSellersProducts(params).then(doSuccess.bind(this),doError);
				}
			});
			
			return BestSellersView;
    }); 
})();