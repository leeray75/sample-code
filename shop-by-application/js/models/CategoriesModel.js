(function(){
	"use strict";
	define("shopByAppPage/models/CategoriesModel",
	[
		"require",
		"shopByAppPage/helpers"
	],
	function(require,helpers){

		var BreadCrumbsModel = Backbone.Model.extend(
		{
			defaults:{
				id: "",
				name: "",
				shareUrl: "",
				url: ""
			}
		});
		
		var CategoryModel = Backbone.Model.extend(
		{
			defaults:{
				"categoryKeys": "",
				"id":"",
				"isLeaf":false,
				"name":"",
				"shareUrl":"",
				"imagePath224x168": "/images/na.gif",
				"imagePath448x336": "/images/na.gif",
				"imagesPath150x150": "/images/na.gif",
				"parentUrl":"",
				"url":""
			},
			getImageSrc: function(){
				return BH.constants.staticUrl+this.get("imagesPath150x150");
			},
			getNvalue: function(){
				var nValue = this.get("id");
				if(isNaN(nValue)){
					var url = this.get("url");
					nValue = helpers.getUrlParamValue(url,'N');
				}
				return nValue;
			}
		});
		
		var SiblingModel = Backbone.Model.extend(
		{
			defaults:{
				"name": "",
				"selected": false,
				"url":""
			},
			getNvalue: function(){
				var nValue = this.get("id");
				if(isNaN(nValue)){
					var url = this.get("url");
					nValue = helpers.getUrlParamValue(url,'N');
				}
				return nValue;
			}
		});
		
		var CategoriesCollection = Backbone.Collection.extend({ 
			model: CategoryModel
		});
		
		var BreadCrumbsCollection = Backbone.Collection.extend({ 
			model: BreadCrumbsModel
		});

		var SiblingsCollection = Backbone.Collection.extend({ 
			model: SiblingModel
		});

		var CategoriesModel = Backbone.Model.extend(
		{
			defaults:{
				catAltName: "",
				breadCrumbs: [],
				categories: [],
				siblings: []
			},
			initialize: function(data){
				var homeBreadCrumb = {
					id: "",
					name: "Home",
					shareUrl: BH.constants.baseUrl,
					url: BH.constants.baseUrl
				}
				data.breadCrumbs.unshift(homeBreadCrumb);
				var breadCrumbs = new BreadCrumbsCollection(data.breadCrumbs);
				var categories = new CategoriesCollection(data.categories);
				var siblings = new SiblingsCollection(data.siblings);
				this.set('breadCrumbs',breadCrumbs);
				this.set('categories',categories);
				this.set('siblings',siblings);
			},
			getTopCategories: function(){
				var categories = this.get("categories");
				categories = categories.toJSON();
				categories = categories.length>4 ? categories.splice(0,3) : categories;
				return new CategoriesCollection(categories);
			},
			getMoreCategories: function(){
				var categories = this.get("categories");
				categories = categories.toJSON();
				categories = categories.length>4 ? categories.splice(3,categories.length) : [];
				return new CategoriesCollection(categories);
			}
		}); // CategoriesModel
		
		return CategoriesModel;
	
	});
})();