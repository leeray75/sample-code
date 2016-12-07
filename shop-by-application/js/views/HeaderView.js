(function () {
	"use strict";
     define("shopByAppPage/views/HeaderView",[
	 	"require",
		"shopByAppPage/helpers",
		"shopByAppPage/router",
		"shopByAppPage/views/header/InspirationView",
		"shopByAppPage/views/header/GuidesTipsView",
		"shopByAppPage/views/header/ArticlesReviewsView",
		"shopByAppPage/views/header/TalkToExpertsView",
		"shopByAppPage/views/header/SiblingCategoriesView"
		],
		function(require,helpers,router,InspirationView,GuidesTipsView,ArticlesReviewsView,TalkToExpertsView,SiblingCategoriesView) {
			var exploraModel = null;
			var categoryModel = null;
			var inspirationView = null;
			var productGuideView = null;
			var beginnerTipsView = null;
			var proTipsView = null;
			var articlesReviewsView = null;
			var talkToExpertsView = null;
			var displayRegionTimeout;
			
			BH.utils.templates.add("ShopByApp.header.SmoothDivScrollContainer", '<div class="smooth-div-scroll-container"></div>');
			
			var LeftColumnView =  Backbone.Marionette.ItemView.extend({
				id: 'explora-left-column-view',
				template: BH.utils.templates.get("ShopByApp.header.LeftColumnView"),
				initialize: function(){},
				events: {
					'click a': 'doClick'
				},
				modelEvents:{
					'change': 'render'
				},
				onRender: function(){},
				onAttach: function() {},
				onDomRefresh: function() {
					var hash = window.location.hash.replace('#','');
					if(hash.length>0 && this.$el.find('[data-section="'+hash+'"]').length>0){
						this.$el.find('[data-section="'+hash+'"] a').trigger('click');
					}
					else{
						this.$el.find('ul > li:first a').trigger('click');
					}
				},
				doClick: function(e){
					var groupName = $(e.currentTarget).attr('href');
					switch(groupName){
						case '#inspiration':
							this.updateDisplay(e,inspirationView);
							break;
						case '#product-guide':
							this.updateDisplay(e,productGuideView);
							break;
						case '#beginner-tips':
							this.updateDisplay(e,beginnerTipsView);
							break;
						case '#pro-tips':
							this.updateDisplay(e,proTipsView);
							break;
						case '#talk-to-experts':
							this.updateDisplay(e,talkToExpertsView);
							break;
						case '#articles-reviews':
							this.updateDisplay(e,articlesReviewsView);
							break;
						default:
							return;

					}

				},
				displayView: null,
				updateDisplay: function(_event,displayView){
					clearTimeout(displayRegionTimeout);
					this.displayView = displayView;
					var thisView = this;
					var displayRegion = thisView.options.displayRegion;
					if(displayRegion.currentView!=null){
						displayRegion.currentView.$el.off('transitionend webkitTransitionEnd oTransitionEnd');
					}
					var doAnimation = function(){
						thisView.$el.find('ul > li.active').removeClass('active');
						$(_event.currentTarget).parent('li').addClass('active');
						if(displayRegion.currentView==null){
							thisView.displayView.$el.addClass('slow-transition');
							displayRegion.show(thisView.displayView);
							
							if (!Modernizr.csstransitions) {
								displayRegion.currentView.$el.removeClass('slow-transition');
								if(!thisView.$el.find('#explora-content').hasClass('open')){
									thisView.$el.find('.open-close-icon-container').trigger('click');
								}
							}
							else{
								displayRegion.currentView.$el.one('transitionend webkitTransitionEnd oTransitionEnd', function(){
									displayRegion.currentView.$el.off('transitionend webkitTransitionEnd oTransitionEnd');
									$(this).removeClass('slow-transition');
									if(!thisView.$el.find('#explora-content').hasClass('open')){
										thisView.$el.find('.open-close-icon-container').trigger('click');
									}
								});
							}
						}
						else if(displayRegion.currentView.$el.hasClass('visible')){
							displayRegion.currentView.$el.removeClass('visible');
							if (!Modernizr.csstransitions) {
								displayRegion.empty({preventDestroy: true});
								displayRegionTimeout = setTimeout(function(){
									displayRegion.show(thisView.displayView);
								},0);
							}
							else{
								displayRegion.currentView.$el.one('transitionend webkitTransitionEnd oTransitionEnd', function(){
									displayRegion.currentView.$el.off('transitionend webkitTransitionEnd oTransitionEnd');
									displayRegion.empty({preventDestroy: true});
									displayRegionTimeout = setTimeout(function(){
										displayRegion.show(thisView.displayView);
									},0);
								});
							}
						}
						else{
							displayRegion.empty({preventDestroy: true});
							displayRegionTimeout = setTimeout(function(){
								displayRegion.show(thisView.displayView);
							},0);
						}
					}; // doAnimation

					if(displayRegion.currentView!=null && $(_event.currentTarget).parent('li').hasClass('active')){
						_event.preventDefault();
					}
					else{
						doAnimation();	
					}
				}
			}); // LeftColumnView
			
			var HeaderView = Backbone.Marionette.LayoutView.extend({
				id: 'header-view',
				className: 'clearfix',
				getTemplate: function(){
					var _template = BH.utils.templates.get("ShopByApp.HeaderView");
					return _template;
				},
				templateHelpers: function () {
					var thisView = this;
					var categoryModel = this.model.get("category");
					return {
						getPageHeader: function(){
							return categoryModel.get("catAltName");
						},
						getSeeOtherTypes: function(){
							var breadCrumbs = categoryModel.get("breadCrumbs");
							var index = breadCrumbs.length>1 ? breadCrumbs.length-2 : 0;
							var breadCrumbModel = breadCrumbs.at(index);
							return "See Other Types of "+breadCrumbModel.get("name");
						}
					}
				},
				initialize: function(options){
					exploraModel = this.model.get("explora");
					categoryModel = this.model.get("category");
				},
				onRender: function(){
					var thisView = this;
					this.doExploraChange();
					setTimeout(function(){
						var siblingCategoriesView = new SiblingCategoriesView({ collection: categoryModel.get("siblings") });
						thisView.getRegion('SiblingCategories').show(siblingCategoriesView);
						if(exploraModel!=null){
							var leftColumnView = new LeftColumnView({ model: exploraModel, displayRegion: this.getRegion('GroupDisplay') });
							thisView.getRegion('LeftColumn').show(leftColumnView);
						}
					}.bind(this),0);
				},
				onShow: function(){
				},
				modelEvents:{
					'change:category': 'doCategoryChange',
					'change:explora': 'doExploraChange'
				},
				regions:{
					"LeftColumn": "#left-column-region",
					"GroupDisplay": "#group-display-region",
					"SiblingCategories": "#sibling-categories-region"
				},
				events:{
					"click .open-close-icon-container": "toggleExploraContent",
					"click .see-other-types": "showSiblingCategories",
				},
				doCategoryChange: function(){
					categoryModel = this.model.get("category");
					this.getRegion('SiblingCategories').currentView.collection.reset(categoryModel.get("siblings").toJSON());
					this.$el.find('h1').html(categoryModel.get("catAltName"));
					this.$el.find('.see-other-types').show();
				},
				doExploraChange: function(){
					exploraModel = this.model.get("explora");
					
					if(exploraModel==null){
						return;	
					}
					var groupModel,itemsCollection;
					if(inspirationView!=null){
						inspirationView.destroy();
					}
					if(exploraModel.get("groupInspiration") != null){
						inspirationView = new InspirationView({model: exploraModel.get("groupInspiration")});
					}
					
					if(productGuideView!=null){
						productGuideView.destroy();
					}
					groupModel = exploraModel.get("groupProductGuides");
					if(groupModel!=null){
						itemsCollection = groupModel.get("items");
						productGuideView = new GuidesTipsView({id: 'product-guide-view', model: groupModel, collection: itemsCollection, isImageClickable: false });
					}
					
					if(beginnerTipsView!=null){
						beginnerTipsView.destroy();
					}
					groupModel = exploraModel.get("groupBeginnersTips");
					if(groupModel!=null){
						itemsCollection = groupModel.get("items");
						beginnerTipsView = new GuidesTipsView({id: 'beginner-tips-view', model: groupModel, collection: itemsCollection });
					}

					if(proTipsView!=null){
						proTipsView.destroy();
					}
					groupModel = exploraModel.get("groupProTips");
					if(groupModel!=null){
						itemsCollection = groupModel.get("items");				
						proTipsView = new GuidesTipsView({id: 'pro-tips-view', model: groupModel, collection: itemsCollection });
					}

					if(articlesReviewsView!=null){
						articlesReviewsView.destroy();
					}
					groupModel = exploraModel.get("groupArticlesReviews");
					if(groupModel!=null){
						itemsCollection = groupModel.get("articles");
						articlesReviewsView = new ArticlesReviewsView({model: groupModel, collection: itemsCollection });
					}

					if(talkToExpertsView!=null){
						talkToExpertsView.destroy();
					}
					groupModel = exploraModel.get("groupTalkToExperts");
					if(groupModel!=null){
						itemsCollection = groupModel.get("experts");
						talkToExpertsView = new TalkToExpertsView({ model: groupModel });
					}

					if(this.getRegion('LeftColumn').currentView == null){
						var leftColumnView = new LeftColumnView({ model: exploraModel, displayRegion: this.getRegion('GroupDisplay') });
						this.getRegion('LeftColumn').show(leftColumnView);	
					}
					else{
						var leftColumnModel = this.getRegion('LeftColumn').currentView.model;
						leftColumnModel.set(exploraModel.toJSON());
					}
				},
				showSiblingCategories: function(e){
					e.preventDefault();
					var sliblingCategoriesView = this.getRegion('SiblingCategories').currentView;
					sliblingCategoriesView.$el.addClass("show");
					$(e.currentTarget).hide();
					
				},
				toggleExploraContent: function(e){
					$(e.currentTarget).toggleClass('closed');
					this.$el.find('#explora-content').toggleClass('open').on('transitionend webkitTransitionEnd oTransitionEnd', function(){;
						$(window).trigger('scroll');
					});
				},
				displayView: null,
				
			}); // HeaderView
			return HeaderView;
    }); 
})();