(function(){
	"use strict";
	define("shopByAppPage/models/ProductItemModel",
	[
		"require"
	],
	function(require){
		var ItemCreateModel = Backbone.Model.extend({
			default: {
				"sku": "",
				"is": "REG",
				"itemCode": "",
				"price": "",
				"inCart": false,
				"inWish": false,
				"li": [],
				"categoryId":  "",
				"searchTerm": ""
			},
			constructor: function(data){
				var itemData = {
					"sku": data["skuNo"],
					"is": data["itemSource"],
					"itemCode": data["itemCode"],
					"price": data["price"],
					"inCart": data["inCart"],
					"inWish": data["inDefaultWishList"],
					"li": [],
					"categoryId":  data["categoryId"],
					"searchTerm": ""
				}
				Backbone.Model.prototype.constructor.call(this, itemData);
			}
		});
		var ProductItemModel = Backbone.Model.extend(
		{
			idAttribute: 'sku',
			defaults: {
				"availableShipping":true,
				"openBoxMessage":"",
				"availableStore":true,
				"isCurrency":false,
				"isFreeShipping":true,
				"isExpediteShipping":true,
				"hasComparison":true,
				"isOpenBox":false,
				"commentMessage":"",
				"isMapPriced":false,
				"cutoffs":[],
				"sellUnit":1,
				"isStandardShipping":true,
				"availableMessage":"",
				"itemCode":"",
				"showEduSavings":"N",
				"detailsUrl":"",
				"image":{  
					"fileName":""
				},
				"inDefaultWishList":false,
				"available":true,
				"stockMessage":"In Stock",
				"sku":"",
				"minSellQty":1,
				"savingsAmount": 0,
				"originalPrice": null,
				"price":"",
				"showShippingInfo":true,
				"listingImage":"",
				"skuNo":"",
				"shortDescription":"",
				"mfgCatalogNo":"",
				"hasBundles":false,
				"mapPrice":"0.00",
				"itemSource":"GREY",
				"showUsedLink":false,
				"overAllRating":0,
				"itemImages":[ ],
				"thumbnail":"",
				"imageSizes":[],
				"description":"",
				"fileName":"",
				"rewards":"",
				"instantRebate": {
					"priceAfterInstantRebate" : "",
					"instantRebateValue": ""
				},
				"includesFree":{
					"TotalValue": "",
					"Item": []	
				},
				"rebates": [] /*[{
					"isOnline": false,
					"rebateFile": "https://static.bhphotovideo.com/FrameWork/Rebates_Promos/093016_CANO67_printer.pdf",
					"description": "Cond. Mail-In Rebate",
					"formattedExpirationDate": "SEP 30 '16",
					"rebateValue": 0
				}]
				*/
			},
			initialize: function(data){
				if(data.hasOwnProperty("originalPrice")){
					var originalPrice = parseFloat(data.originalPrice.replace(new RegExp(',', 'g'), ''));
					var salePrice = parseFloat(data.price.replace(new RegExp(',', 'g'), ''));
					var savings = originalPrice - salePrice;
					this.set("savingsAmount",savings);
				}
				var rebates = this.get("rebates");
				if(rebates.length>0){
					this.conditionalRebates = rebates.filter(function(rebate){
						return rebate.hasOwnProperty("rebateFile") && rebate.description.indexOf("Cond. Mail-In Rebate")>-1;
					});
					this.regularRebates = rebates.filter(function(rebate){
						return rebate.hasOwnProperty("rebateFile") && rebate.description.indexOf("Cond. Mail-In Rebate")<0;
					});
				}
			},
			conditionalRebates: [],
			regularRebates: [],
			getImage: function(){
				var image = this.get("image");
				return (typeof(image) == 'string') ? image : image.fileName;
			},
			getItemCreateModel: function(){
				return new ItemCreateModel(this.toJSON());
			},
			getSavingsAmount: function(){
				var originalPrice = this.get("originalPrice");
				var savings = 0;
				if(originalPrice!=null){
					var instantRebate = this.get("instantRebate");
					savings = typeof(instantRebate.instantRebateValue)=='string' ? parseFloat(instantRebate.instantRebateValue.replace(new RegExp(',', 'g'), '')) : instantRebate.instantRebateValue;
				}
				return savings;
			},
			hasConditionalRebates: function(){
				return this.get("showInstantRebate")=="Y" && this.conditionalRebates.length>0;
			},
			hasRegularRebates: function(){
				return this.get("showInstantRebate")=="Y" && this.regularRebates.length>0;
			},
		});
	
		return ProductItemModel;
	
	});
})();
