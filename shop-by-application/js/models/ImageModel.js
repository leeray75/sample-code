(function(){
	"use strict";
	define("shopByAppPage/models/ImageModel",
	[
		"require"
	],
	function(require){
		var _ExifModel = Backbone.Model.extend(
		{
			defaults: {
				label: "",
				value: "",
				url: ""
			}
		});
		
		var _ExifCollection  = Backbone.Collection.extend({ 
			model: _ExifModel
		});
		
		var ImageModel = Backbone.Model.extend(
		{
			defaults: {
				path: "",
				path_enlarged: "",
				path_smaller: "",
				path_thumbnail: "",
				text: "",
				title: "",
				alt: "",
				exif: []
			},
			initialize: function(data){
				var _exif;
				if(typeof(data)!='undefined' && data.hasOwnProperty("exif") && $.isArray(data.exif) && data.exif.length>0){
					_exif = new _ExifCollection(data.exif);
				}
				else{
					_exif = new _ExifCollection();
				}
				this.set("exif",_exif);
			},
			getImageSrc: function(pathAttr){
				var imagePath = this.get(pathAttr);
				imagePath = imagePath.replace(/^(https?):/,'');
				if(document.location.hostname.indexOf("localhost")>-1){
					imagePath = imagePath.replace("//blogdev.bhphotovideo.com","");
				}
				return imagePath;
			}
		});
	
		return ImageModel;
	
	});
})();
