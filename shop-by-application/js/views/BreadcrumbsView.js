(function () {
	"use strict";
     define("shopByAppPage/views/BreadcrumbsView",[
	 	"require"
		],
		function(require) {
			BH.utils.templates.add("ShopByApp.BreadcrumbsView", "<ul id='breadcrumbs' class='twelve'></ul>");
			BH.utils.templates.add("ShopByApp.Breadcrumbs.ItemView", '<a href="<%- getLink() %>"><%=getName() %></a>');
			var _BreadcrumbItemView=  Backbone.Marionette.ItemView.extend({
				tagName: 'li',
				className: '',
				getTemplate: function(){
					return BH.utils.templates.get("ShopByApp.Breadcrumbs.ItemView");
				},
				templateHelpers: function () {
					var model = this.model;
					return {
						getName: function(){
							return model.get("name");
						},
						getLink: function(){
							return model.get("shareUrl");	
						}
					}
				},
				initialize: function(options){},
				onRender: function(){}
			});
			
			var BreadcrumbsView = Backbone.Marionette.CompositeView.extend({
				id: 'breadcrumbs-view',
				className: 'new-page-width clearfix',
				childView: _BreadcrumbItemView,
				childViewContainer: '#breadcrumbs',
				template: BH.utils.templates.get("ShopByApp.BreadcrumbsView"),
				templateHelpers: function(){},
				initialize: function(options){},
				onRender: function(){
					if(this.collection.length==0){
						this.$el.hide();	
					}
				}
			});
			
			return BreadcrumbsView;
    }); 
})();