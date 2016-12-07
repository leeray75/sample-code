(function () {
	"use strict";
     define("shopByAppPage/views/header/ArticlesReviewsView",
	 	["require","shopByAppPage/helpers"],
		function(require,helpers) {

			var ItemColumnView = Backbone.Marionette.ItemView.extend({
				tagName: 'div',
				className: 'item-container',
				template: BH.utils.templates.get("ShopByApp.header.ArticlesReviews.ItemView"),
				templateHelpers: function () {
					var model = this.model;
					var imageModel = model.get("image");
					return{
						getImageAltValue: function(){
							return imageModel.get("alt");
						},
						getImageSrc: function(){
							return imageModel.getImageSrc('path_thumbnail');
						},
						getUrl: function(){
							return model.get("url");
						},
						getPublishAge: function(){
							return model.get("timeAgo");
						},
						getTitle: function(){
							return model.get("title");	
						}
					}
				},
				initialize: function(){},
				onRender: function(){
					if ( !Modernizr.objectfit ) {
						var imageModel = this.model.get("image");
						var imagePath = imageModel.get("path_thumbnail");
						imagePath = imagePath.replace(/^(https?):/,'');
						if(document.location.hostname.indexOf("localhost")>-1){
							imagePath = imagePath.replace("//blogdev.bhphotovideo.com","");
						}
						this.$el.find('.image-container')
							.css('backgroundImage', 'url(' + imagePath + ')')
							.addClass('compat-object-fit');
					}
				}
				
			}); //ThreeImagesColumnView

			
			var ArticlesReviewsView = Backbone.Marionette.CompositeView.extend({
				id: 'articles-reviews-view',
				className: 'not-ready clearfix',
				childView: ItemColumnView,
				childViewContainer: '.smooth-div-scroll-container',
				getTemplate: function(){
					return BH.utils.templates.get("ShopByApp.header.SmoothDivScrollContainer");
				},
				templateHelpers: function () {
					var model = this.model;
					return {
					}
				},
				initialize: function(options){
				},
				onRender: function(){
					
				},
				onShow: function(){
				},
				onAttach: function(){
					helpers.initSmoothDivScroll(this.$el);
				},
				onDomRefresh: function(){
					if(this.$el.find('.scrollWrapper').length == 0){
						helpers.initSmoothDivScroll(this.$el);
					}
				},
				modelEvents:{
				},
				events:{
	
				}
	
			});
		return ArticlesReviewsView;
    }); 
})();