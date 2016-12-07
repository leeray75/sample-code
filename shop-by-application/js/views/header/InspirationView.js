(function () {
	"use strict";
     define("shopByAppPage/views/header/InspirationView",
	 	["require","shopByAppPage/helpers","shopByAppPage/collections/ImagesCollection"],
		function(require,helpers,ImagesCollection) {
			BH.utils.templates.add("ShopByApp.header.Inspiration.ImageView", "<img src='<%=getImageSrc()%>' alt='<%-getImageAlt()%>'>");
			BH.utils.templates.add("ShopByApp.header.Inspiration.SingleImageColumnView", "<div class='single-image'></div>");
			BH.utils.templates.add("ShopByApp.header.Inspiration.ExifView", "<div class='content-container'><h4><%= getImageTitle() %></h4><ul class='exif-list'></ul></div>");
			BH.utils.templates.add("ShopByApp.header.Inspiration.ExifView.DefaultItem", "<span class='label'><%=getLabel()%>:</span> <span class='value'><%= getValue() %></span>");
			BH.utils.templates.add("ShopByApp.header.Inspiration.ExifView.ProductLinkItem", "<span class='label'><%=getLabel()%>:</span> <a href='<%=getLink()%>' class='value'><%= getValue() %></a>");
			
			var ExifItem = Backbone.Marionette.ItemView.extend({
				tagName: 'li',
				className: 'exif-item',
				getTemplate: function(){
					var url = this.model.get("url");
					if(url.length>0){
						return BH.utils.templates.get("ShopByApp.header.Inspiration.ExifView.ProductLinkItem")
					}
					else{
						return BH.utils.templates.get("ShopByApp.header.Inspiration.ExifView.DefaultItem")
					}
				},
				templateHelpers: function(){
					var model = this.model;
					return{
						getLabel: function(){
							return model.get("label");
						},
						getLink: function(){
							return model.get("url");
						},
						getValue: function(){
							return model.get("value");
						}
					}
				},
				events:{
					'click a': 'doClick'	
				},
				doClick: function(e){
					e.stopPropagation();	
				}
			});
			
			var ExifView = Backbone.Marionette.CompositeView.extend({
				className: 'exif-container',
				childView: ExifItem,
				childViewContainer: '.exif-list',
				template: BH.utils.templates.get("ShopByApp.header.Inspiration.ExifView"),
				templateHelpers: function(){
					var model = this.model;
					return{
						getImageTitle: function(){
							return model.get("title");
						}
					}
				}
			}); // ExifView
			
			var ImageView = Backbone.Marionette.ItemView.extend({
				className: 'image-container',
				template: BH.utils.templates.get("ShopByApp.header.Inspiration.ImageView"),
				templateHelpers: function(){
					var model = this.model;
					return{
						getImageAlt: function(){
							return model.get("alt");
						},
						getImageSrc: function(){
							return model.getImageSrc('path_smaller');
						}
					}
				},
				events:{
					"click": "doClick"
				},
				onRender: function(){
					var exifs = this.model.get("exif");
					if(exifs.length>0){
						var exifView = new ExifView({ model: this.model, collection: exifs });
						exifView.render();
						this.$el.append(exifView.$el);
					}
					if ( !Modernizr.objectfit ) {
						var imagePath = this.model.get("path_enlarged");
						imagePath = imagePath.replace(/^(https?):/,'');
						if(document.location.hostname.indexOf("localhost")>-1){
							imagePath = imagePath.replace("//blogdev.bhphotovideo.com","");
						}
						this.$el.find('.image-container')
							.css('backgroundImage', 'url(' + imagePath + ')')
							.addClass('compat-object-fit');
					}
				},
				doClick: function(e){
					$('#ShopByApplicationPage').trigger('show-image-viewer', [this.model.toJSON()]);
				}
			});
			var SingleImageColumnView = Backbone.Marionette.ItemView.extend({
				tagName: 'div',
				className: 'item-container single-image-item',
				template: BH.utils.templates.get("ShopByApp.header.Inspiration.SingleImageColumnView"),
				templateHelpers: function () {},
				initialize: function(){},
				onRender: function(){
					var imageView = new ImageView({model: this.model});
					imageView.render();
					this.$el.find('.single-image').append(imageView.$el);
				}
				
			}); 
			var ThreeImagesColumnView = Backbone.Marionette.ItemView.extend({
				tagName: 'div',
				className: 'item-container three-images-item',
				template: BH.utils.templates.get("ShopByApp.header.ThreeImagesColumnView"),
				templateHelpers: function () {},
				initialize: function(){
				},
				onRender: function(){
					var columnView = this;
					this.collection.each(function(image,index){
						var imageView = new ImageView({model: image});
						imageView.render();
						if(index==0){
							columnView.$el.find('.top-image').append(imageView.$el);
						}
						else if(index==1){
							columnView.$el.find('.left-image').append(imageView.$el);
						}
						else{
							columnView.$el.find('.right-image').append(imageView.$el);
						}
					});
				}
				
			}); //ThreeImagesColumnView
			
			var InspirationView = Backbone.Marionette.ItemView.extend({
				id: 'inspiration-group-view',
				className: 'not-ready clearfix',
				getTemplate: function(){
					return BH.utils.templates.get("ShopByApp.header.SmoothDivScrollContainer");
				},
				templateHelpers: function () {
					var model = this.model;
					return {
						getPageHeader: function(){
							return this.title;
						},
						getSeeOtherTypes: function(){
							return "See Other Type of Photography";	
						}
					}
				},
				initialize: function(options){
					var images = this.model.get("images");
					this.collection = images;
				},
				onRender: function(){
					this.renderColumns();
				},
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
				renderColumns: function(){
					var columnImages = new ImagesCollection();
					var images = this.collection;
					var $imageList = this.$el.find('.smooth-div-scroll-container');
					$imageList.empty();
					var $imageViewPort = null;
					var maxImages = 5;
					var allowLeftColumn = images.length>2;
					images.each(function(image,index){
						var mod = index%maxImages ;
						var imagesLeft = images.length-index-1;
						if(allowLeftColumn && mod<3){
							columnImages.push(image);
							if(columnImages.length==3){							
								var column = new ThreeImagesColumnView({collection: columnImages});
								column.render();
								$imageList.append(column.$el);
								columnImages = new ImagesCollection();
							}
						}
						else{
							var singleImageCol = new SingleImageColumnView({ model: image});
							singleImageCol.render();
							if(mod>3){
								singleImageCol.$el.addClass('thin-column');
							}
							$imageList.append(singleImageCol.$el);
						}

						if( mod>3 || imagesLeft==0){
							allowLeftColumn = imagesLeft>2;
						}
					});
				}
	
			});
		return InspirationView;
    }); 
})();