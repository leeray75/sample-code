(function(){
	"use strict";
	define("shopByAppPage/models/ExploraModel",
	[
		"require",
		"shopByAppPage/models/InspirationModel",
		"shopByAppPage/models/TalkToExpertsModel",
		"shopByAppPage/models/ArticlesReviewsModel",
		"shopByAppPage/models/GuidesTipsModel",
		"shopByAppPage/models/CategoriesModel"
	],
	function(require, InspirationModel, TalkToExpertsModel, ArticlesReviewsModel, GuidesTipsModel){

		var ExploraModel = Backbone.Model.extend(
		{
			idAttribute: 'ci',
			defaults: {
				groupArticlesReviews: null,
				groupInspiration: null,
				groupProductGuides: null,
				groupBeginnersTips: null,
				groupProTips: null,
				groupTalkToExperts: null,
			},
			initialize: function(data){
				var thisModel = this;
				var guidesTipsGroups = ["groupProductGuides","groupBeginnersTips","groupProTips"]

				if(data.hasOwnProperty("groupInspiration")){
					var _inspirations = new InspirationModel(data.groupInspiration);
					thisModel.set("groupInspiration",_inspirations);
				}
				
				if(data.hasOwnProperty("groupTalkToExperts")){
					var _talkToExperts = new TalkToExpertsModel(data.groupTalkToExperts);
					thisModel.set("groupTalkToExperts",_talkToExperts);
				}
				
				if(data.hasOwnProperty("groupArticlesReviews")){
					var _articleReviews = new ArticlesReviewsModel(data.groupArticlesReviews);
					thisModel.set("groupArticlesReviews",_articleReviews);
				}
				
				_.each(guidesTipsGroups,function(groupName){
					if(data.hasOwnProperty(groupName)){
						var _group = new GuidesTipsModel(data[groupName]);
						thisModel.set(groupName,_group);
					}
				});
				
			}
		}); // _ExploraModel
		
		
		return ExploraModel;
	
	});
})();