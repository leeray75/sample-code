(function () {
	"use strict";
     define("shopByAppPage/views/header/SiblingCategoriesView",
	 	["require","shopByAppPage/helpers","shopByAppPage/router"],
		function(require,helpers,router) {
			BH.utils.templates.add("ShopByApp.SiblingCategoriesView", "<ul class='sibling-categories-list'></ul>");
			BH.utils.templates.add("ShopByApp.SiblingCategories.ItemLinkView", '<a href="<%- getLink() %>" data-app-route="<%- getAppLink() %>"><%=getName() %></a>');
			BH.utils.templates.add("ShopByApp.SiblingCategories.ItemSelectedView", '<span><%=getName() %></span>');
			var isClicksAllow = false;
			var _CategoryItemView=  Backbone.Marionette.ItemView.extend({
				tagName: 'li',
				className: 'sibling-category-item',
				getTemplate: function(){
					if(this.model.get("selected")){
						return BH.utils.templates.get("ShopByApp.SiblingCategories.ItemSelectedView");
					} else{
						return BH.utils.templates.get("ShopByApp.SiblingCategories.ItemLinkView");
					}
				},
				templateHelpers: function () {
					var model = this.model;
					return {
						getAppLink: function(){
							var ciValue = helpers.getUrlParamValue(model.get("url"),"ci");
							var nValue = helpers.getUrlParamValue(model.get("url"),"N");
							var routePath = BH.constants.findUrl+BH.globals.currPageName+"/ci/"+ciValue+"/N/"+nValue;
							//return model.get("url");
							return routePath;
						},
						getName: function(){
							return model.get("name");
						},
						getLink: function(){
							return model.get("url");
						}
					}
				},
				initialize: function(options){},
				onRender: function(){}
			});
			
			var SiblingCategoriesView = Backbone.Marionette.CompositeView.extend({
				id: 'sibling-categories-view',
				className: 'new-page-width clearfix',
				childView: _CategoryItemView,
				childViewContainer: '.sibling-categories-list',
				template: BH.utils.templates.get("ShopByApp.SiblingCategoriesView"),
				templateHelpers: function(){},
				initialize: function(options){},
				collectionEvents:{
					"reset": "doReset"
				},
				onRender: function(){},
				onDomRefresh: function(){},
				doReset: function(){
					this.$el.removeClass("show");
				}
			});
			
			return SiblingCategoriesView;
    }); 
})();