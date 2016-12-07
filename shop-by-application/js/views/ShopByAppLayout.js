(function () {
    define("shopByAppPage/views/ShopByAppLayout",
	[
		"require",
		"Services",
		"shopByAppPage/views/BreadcrumbsView",
		"shopByAppPage/views/HeaderView",
		"shopByAppPage/views/TopCategoriesView",
		"shopByAppPage/views/MoreCategoriesView",
		"shopByAppPage/views/BestSellersView",
		"shopByAppPage/views/ImageViewerView"
	],function(require, Services, BreadcrumbsView, HeaderView, TopCategoriesView, MoreCategoriesView, BestSellersView, ImageViewerView) {
		
		var category,topCategories,moreCategories,breadcrumbs,breadcrumbsView,headerView,topCategeriesView,moreCategoriesView,bestSellersView,imageViewerView;
		
        return Backbone.Marionette.LayoutView.extend({
			id: 'ShopByAppLayoutView',
            template: BH.utils.templates.get("ShopByApp.AppLayoutView"),
			templateHelpers: function () {
                return {
                }
            },
            regions: {
				'breadcrumbs': '#breadcrumbs-region',
				'header': '#header-region',
				'top-categories': '#top-categories-region',
				'more-categories': '#more-categories-region',
				'best-sellers': '#best-sellers-region',
				'image-viewer': '#image-viewer-region'

            },
			initialize: function(){	
				category = this.model.get("category");
				topCategories = category.getTopCategories();
				moreCategories = category.getMoreCategories();
				breadcrumbs = category.get("breadCrumbs");
				breadcrumbsView = new BreadcrumbsView({ collection: breadcrumbs });
				headerView = new HeaderView({model: this.model});
				topCategeriesView = new TopCategoriesView({ collection: topCategories });
				moreCategoriesView = new MoreCategoriesView({model: category, collection: moreCategories });
				bestSellersView = new BestSellersView({ model: category });
				imageViewerView = new ImageViewerView();
			},
			modelEvents:{
				"change": "doRender"
			},
			onRender: function(){
				this.getRegion('breadcrumbs').show(breadcrumbsView);
				this.getRegion('header').show(headerView);
				this.getRegion('top-categories').show(topCategeriesView);
				this.getRegion('more-categories').show(moreCategoriesView);
				this.getRegion('best-sellers').show(bestSellersView);
				this.getRegion('image-viewer').show(imageViewerView);
			},
			doRender: function(){
				category = this.model.get("category");
				topCategories = category.getTopCategories();
				moreCategories = category.getMoreCategories();
				breadcrumbs = category.get("breadCrumbs");
				breadcrumbsView.collection = breadcrumbs;
				topCategeriesView.collection = topCategories;
				moreCategoriesView.model = category;
				moreCategoriesView.collection = moreCategories;
				breadcrumbsView.render();
				topCategeriesView.render();
				moreCategoriesView.render();
				bestSellersView.collection.reset([]);
				
			}

        });
    }); 
})();