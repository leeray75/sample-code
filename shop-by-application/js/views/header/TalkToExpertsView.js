(function () {
	"use strict";
     define("shopByAppPage/views/header/TalkToExpertsView",[
	 	"require"
		],
		function(require) {
			BH.utils.templates.add("ShopByApp.header.TalkToExperts.ExpertImageView", '<img src="<%- getImageSrc() %>" alt="<%- getImageAltValue() %>">');

			var ExpertItemView = Backbone.Marionette.ItemView.extend({
				tagName: 'div',
				className: 'expert-image-container',
				template: BH.utils.templates.get("ShopByApp.header.TalkToExperts.ExpertImageView"),
				templateHelpers: function () {
					var view = this;
					var imageModel = this.model.get("image");

					return{
						getImageAltValue: function(){
							return imageModel.get("alt");
						},
						getImageSrc: function(){
							return imageModel.getImageSrc('path');
						}
					}
				},
				initialize: function(options){},
				onRender: function(){
					var imageModel = this.model.get("image");
					this.$el.attr('title',imageModel.get('title'));
				}

			}); //ExpertItemView
			
			var TalkToExpertsView = Backbone.Marionette.CompositeView.extend({
				id: 'talk-to-experts-view',
				className: 'clearfix',
				childView: ExpertItemView,
				childViewContainer: '.experts-images',
				template: BH.utils.templates.get("ShopByApp.header.TalkToExpertsView"),
				templateHelpers: function(){
					var model = this.model;
					return{
						getChatLink: function(){
							return "//bhphotovideo.secure.force.com/prechat?language=english&option=a0i1a000001O6LxAAK&wid=10205BFC747";
							//return model.get("link");
						},
						getEmailLink: function(){
							return BH.constants.findUrl+"contactForm.jsp";
						},
						getTelephoneLink: function(){
							return "tel:+18006066969";
						},
						getTelephoneNumber: function(){
							return "800.606.6969";
						},
						getText: function(){
							return model.get("text");
						},
						getViewExpertsLink: function(){
							return model.get("link");
						}
					}
				},
				initialize: function(options){
					this.collection = this.model.get("experts");
				},
				events:{
					'click .chat-link': 'openChat'
				},
				onBeforeRender: function(){},
				onRender: function(){
					var expertsLink = this.model.get("link");
					if(expertsLink==null || expertsLink.length==0){
						this.$el.find('.meet-our-experts-item').remove();	
					}
				},
				onDomRefresh: function(){
					setTimeout(function(){
						this.$el.addClass('visible');
					}.bind(this),10);
				},
				openChat: function(e){
					var el = e.currentTarget;
					window.open(el.href, el.target, 'height=400,width=580,resizable=yes,scrollbars=no');
					e.preventDefault();
				}
			});
			
			return TalkToExpertsView;
    }); 
})();