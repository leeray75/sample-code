(function(){
	"use strict";
	define("shopByAppPage/models/TalkToExpertsModel",
	[
		"require",
		"shopByAppPage/models/ImageModel"
	],
	function(require,ImageModel){
		var _ExpertsModel = Backbone.Model.extend(
		{
			defaults: {
				id: '',
				name: '',
				description: '',
				image: null,     
				url: ''
			},
			initialize: function(data){
				if(data.hasOwnProperty("image")){
					var _image = new ImageModel(data.image);
					this.set("image",_image);
				}
			}
		});
		
		var _ExpertsCollection  = Backbone.Collection.extend({ 
			model: _ExpertsModel
		});
		
		var TalkToExpertsModel = Backbone.Model.extend(
		{
			defaults: {
				link: '',
				text: '',
				experts: []
			},
			initialize: function(data){
				var _experts;
				if(data.hasOwnProperty("experts") && $.isArray(data.experts) && data.experts.length>0){
					_experts = new _ExpertsCollection(data.experts);
				}
				else{
					_experts = new _ExpertsCollection();
				}
				this.set("experts",_experts);
			}
		});
	
		return TalkToExpertsModel;
	
	});
})();
