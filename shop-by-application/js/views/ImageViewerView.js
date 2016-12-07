(function () {
	"use strict";
     define("shopByAppPage/views/ImageViewerView",[
	 	"require",
		"shopByAppPage/models/ImageModel"
		],
		function(require,ImageModel) {
			BH.utils.templates.add("ShopByApp.ImageViewerView", '<div class="image-modal-container"><div class="image-container"><img src="<%-getImage()%>"></div></div>');
				
			var ImageViewerView = Backbone.Marionette.ItemView.extend({
				id: 'image-viewer-view',
				className: 'new-page-width clearfix',
				template: BH.utils.templates.get("ShopByApp.ImageViewerView"),
				templateHelpers: function(){
					var model = this.model;
					return {
						getImage: function(){
							return model.getImageSrc('path_enlarged');
						}
					}
				},
				initialize: function(options){
					var imageModel = this.model = new ImageModel();
					$('#ShopByApplicationPage').on('show-image-viewer',function(e,obj){
						var data = _.extend({},imageModel.defaults,obj);
						imageModel.set(data);
					});
				},
				events:{
					'click': 'hideImage'
				},
				modelEvents:{
					"change:path_enlarged": "render"
				},
				onRender: function(){
					var imagePath = this.model.get("path_enlarged");
					if(imagePath.length>0){
						this.$el.show();
					}
					else{
						this.$el.hide();	
					}
				},
				onDomRefresh: function(){
					var imagePath = this.model.get("path_enlarged");
					if(imagePath.length>0){
						this.$el.find('img').on('load',function(){
							this.$el.find('.image-modal-container').addClass('show');	
						}.bind(this));
					}
				},
				hideImage: function(e){					
					var $imageContainer = this.$el.find('.image-modal-container');
					if($imageContainer.hasClass('show')){
						$imageContainer.removeClass('show').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
							this.model.set(this.model.defaults);
						}.bind(this));
					}
				},
				
			});
			
			return ImageViewerView;
    }); 
})();