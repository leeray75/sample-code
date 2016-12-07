(function () {
	"use strict";
     define("shopByAppPage/views/header/GuidesTipsView",
	 	["require","shopByAppPage/helpers"],
		function(require,helpers) {

			var ItemColumnView = Backbone.Marionette.ItemView.extend({
				tagName: 'div',
				className: 'item-container',
				templateHelpers: function () {
					var view = this;
					var model = this.model;
					var imageModel = model.get("image");
					var badgeModel = model.get("badge");
					return{
						getBadgeText: function(){
							//return badgeModel.get("value");
							return "";
						},
						getImageAltValue: function(){
							return imageModel.get("alt");
						},
						getImageSrc: function(){
							return imageModel.getImageSrc('path_thumbnail');
						},
						getItemNumber: function(){
							return view._index+1;
						},
						getText: function(){
							return model.get("text");
						},
						getTitle: function(){
							return model.get("title");	
						}
					}
				},
				initialize: function(options){
					this.isImageClickable = options.hasOwnProperty("isImageClickable") ?  options.isImageClickable : true;
					this.getTemplate = options.getTemplate;
				},
				events: function(){
					if(!this.isImageClickable){
						return {};
					}
					return {
						'click .image-container': 'showImage'
					}
				},
				onRender: function(){
					/*
					var badgeModel = this.model.get("badge");
					var badgeColor = badgeModel.get("color");
					var badgeValue = badgeModel.get("value");
					if(badgeValue.length>0){
						var $badge = this.$el.find(".badge");
						$badge.css("background-color",badgeColor);
						$badge.removeClass("hidden").addClass(badgeColor);	
					}
					*/
					if ( ! Modernizr.objectfit ) {
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
				},
				isImageClickable: true,
				showImage: function(e){
					var imageModel = this.model.get("image");
					$('#ShopByApplicationPage').trigger('show-image-viewer', [imageModel.toJSON()]);	
				}
			}); //ItemColumnView

			
			var GuidesTipsView = Backbone.Marionette.CompositeView.extend({
				className: 'guides-tips-view not-ready clearfix',
				childView: ItemColumnView,
				childViewContainer: '.smooth-div-scroll-container',
				childViewOptions: function(model,index){
					var thisView = this;
					return {
						isImageClickable: this.isImageClickable,
						getTemplate: function(){
							if(thisView.id=="beginner-tips-view"){
								return	BH.utils.templates.get("ShopByApp.header.BeginnerTips.ItemView");
							}
							else{
								return BH.utils.templates.get("ShopByApp.header.GuidesTips.ItemView");	
							}
						}
					}
				},
				getTemplate: function(){
					return BH.utils.templates.get("ShopByApp.header.SmoothDivScrollContainer");
				},
				templateHelpers: function () {
					var model = this.model;
					return {
					}
				},
				initialize: function(options){
					this.isImageClickable = options.hasOwnProperty("isImageClickable") ?  options.isImageClickable : true;
				},
				onRender: function(){},
				onShow: function(){},
				onAttach: function(){
					helpers.initSmoothDivScroll(this.$el);
				},
				onDomRefresh: function(){
					if(this.$el.find('.scrollWrapper').length == 0){
						helpers.initSmoothDivScroll(this.$el);
					}
				},
				modelEvents:{},
				events:{},
				isImageClickable: true
	
			});
		return GuidesTipsView;
    }); 
})();