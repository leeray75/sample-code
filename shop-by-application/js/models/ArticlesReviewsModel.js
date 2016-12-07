(function(){
	"use strict";
	define("shopByAppPage/models/ArticlesReviewsModel",
	[
		"require",
		"shopByAppPage/models/ImageModel"
	],
	function(require,ImageModel){
		var _ArticleModel = Backbone.Model.extend(
		{
			defaults: {
				title: '',
				image: null,
				hasVideo: false,
				timeAgo: '',
				url: ''
			},
			initialize: function(data){
				if(data.hasOwnProperty("image")){
					if( typeof(data.image) === "string"){
						data.image = { path: data.image };
					}
					var _image = new ImageModel(data.image);
					this.set("image",_image);
				}
			}
		});
		
		var _ArticlesCollection  = Backbone.Collection.extend({ 
			model: _ArticleModel
		});
		
		var ArticlesReviewsModel = Backbone.Model.extend(
		{
			defaults: {
				articles: []
			},
			initialize: function(data){
				if(data.hasOwnProperty("articles") && $.isArray(data.articles) && data.articles.length>0){
					var _articles = new _ArticlesCollection(data.articles);
					this.set("articles",_articles);
				}
			}
		});
	
		return ArticlesReviewsModel;
	
	});
})();
