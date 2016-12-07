(function() {
	"use strict";
	var saveForLaterModule = angular.module('saveForLaterModule', ['ngSanitize']);
	saveForLaterModule.factory('dataFactory', ['$http',
		function($http) {
			var urlBase = BH.constants.apiUrl
			var dataFactory = {};
			var savedItems = {
				date: "",
				id: "",
				itemCount: 0,
				items: [],
				subTotal: ""
			};
			dataFactory.getItems = function() {
				var _data = {
					A: 'SaveForLater',
					O: ''
				}
				var req = {
					method: 'GET',
					url: urlBase,
					params: _data	
				}
				return $http(req);
			}
			
			dataFactory.addItem = function(itemModel) {
				var _data = {
					A: 'SaveForLater',
					P: 'add',
					O: '',
					sku: itemModel.skuNo,
					is: itemModel.itemSource,
				}
				var req = {
					method: 'GET',
					url: urlBase,
					params: _data	
				}
				return $http(req);
			}
			
			dataFactory.moveToCart = function(itemModel){
				var _data = {
					O: '',
					A: 'SaveForLater',
					P: 'cart',
					sku: itemModel.skuNo,
					is: itemModel.itemSource
				}
				var req = {
					method: 'GET',
					url: urlBase,
					params: _data	
				}
				return $http(req);
			}
						
			dataFactory.removeItem = function(itemModel){
				var _data = {
					O: '',
					A: 'SaveForLater',
					P: 'del',
					sku: itemModel.skuNo,
					is: itemModel.itemSource
				}
				var req = {
					method: 'GET',
					url: urlBase,
					params: _data	
				}
				return $http(req);
			}
			
			dataFactory.moveToWishList = function(itemModel){
				var urlBase = BH.constants.apiUrl;
				var _data = {
					O: '',
					A: 'addToDefaultWishList',
					addToDefaultList: true,
					listName: 'default',
					skus: itemModel.sku+"_1",
					via: "js"
				}
				var req = {
					method: 'GET',
					url: urlBase,
					params: _data	
				}
				return $http(req);
			}
			
			return dataFactory;
		}
	]); // dataFactory
	
	saveForLaterModule.factory('templateHelper', ['$sanitize',
		function($sanitize) {
			var TemplateHelper = function(_itemModel){
				var itemModel = _itemModel;
				var templateHelper = {
					getBrand: function(){
						return itemModel.brand;
					},
					getDetailsUrl: function(){
						return itemModel.detailsUrl;	
					},
					getFreeItems: function(){
						return itemModel.hasOwnProperty('includedFree') ? itemModel.includedFree.Item : [];
					},
					getFreeItemLabel: function(){
						var label = "";
						if(this.hasFreeItems()){
							if(itemModel.includedFree.hasOwnProperty('TotalValue')){
								label = "Total Value";
							}
							else if(itemModel.includedFree.hasOwnProperty("Value")){
								label = "Value";
							}
						}
						return label;
					},
					getFreeItemValue: function(){
						var value = "$0.00";
						if(itemModel.hasOwnProperty('includedFree')){
							if(itemModel.includedFree.hasOwnProperty('TotalValue')){
								value = itemModel.includedFree.TotalValue
							}
							else if(itemModel.includedFree.hasOwnProperty("Value")){
								value = itemModel.includedFree.Value;	
							}
						}
						return value;
					},
					getFreeShippingLink: function(){
						return itemModel.shippingNoteAndLink.link;
					},
					getFreeShippingDescription: function(){
						return itemModel.shippingNoteAndLink.title;
					},
					getImage: function(){
						return itemModel.image;
					},
					getImageAltValue: function(){
						return $sanitize(itemModel.shortDescription);
					},
					getPrice: function(){
						return "$"+itemModel.price;
					},
					getProductName: function(){
						return itemModel.shortDescription;
					},
					getProductNumbers: function(){
						var _productNumbers = "B&amp;H #"+itemModel.itemCode;
						_productNumbers += itemModel.mfgCatalogNo.length>0 ? "&nbsp;&bull;&nbsp;MFR #"+$sanitize(itemModel.mfgCatalogNo) : "";
						return _productNumbers;
					},
					getRewardsLink: function(){
						if(this.hasRewardPoints()){
							return itemModel.rewardsMsgsAndLink.link;
						}
						else{
							return "";	
						}
					},
					getRewardsMessage: function(){
						if(this.hasRewardPoints()){
							return itemModel.rewardsMsgsAndLink.rewardMsg;
						}
						else{
							return "";	
						}
					},
					getRewardsShipmentMessage: function(){
						if(this.hasRewardPoints()){
							return itemModel.rewardsMsgsAndLink.shipmentMsg;
						}
						else{
							return "";	
						}
					},
					getStockMessage: function(){
						return itemModel.shipTimeMessage.availability;	
					},
					getStockSeleniumData: function(){
						return this.isInStock() ? "inStock" : "notStock";
					},
					getShipTimeComments: function(){
						if(!itemModel.shipTimeMessage.hasCommentDescription){
							return "";	
						}
						else{
							return itemModel.commentMessage;
						}
					},
					getShipTimeMessage: function(){
						return itemModel.shipTimeMessage.shipTime;
					},
					hasCommentDescription: function(){
						return itemModel.shipTimeMessage.hasCommentDescription;
					},
					hasFreeItems: function(){
						return this.getFreeItems().length > 0;
					},
					hasRewardPoints: function(){
						return itemModel.hasOwnProperty("rewards");
					},
					isInStock: function(){
						return itemModel.stockMessage.toLowerCase()=="in stock";
					}
					
				}
				return templateHelper;
			}
			
			return {
				get: function(_itemModel){
					return new TemplateHelper(_itemModel);
				}
			};
		}
	]); // templateHelper
	
	saveForLaterModule.controller('displayItemsController', ['$scope', 'dataFactory', function($scope, dataFactory){
		var vm = this;
		vm.isModuleVisible = false;
		vm.data = $scope.saveForLaterData = {
			items: []
		};
		var getItems = function(){
			dataFactory.getItems().then(function(response){
				angular.copy(response.data,vm.data);
				vm.isModuleVisible = BH.cart.getItems().length>0 || (vm.data.items.length>0);
			},function(error){});
		}
		vm.getItems = $scope.getItems = getItems;

		if(BH.globals.loggedIn){
			getItems();
		}
		else{
			vm.isModuleVisible = BH.cart.getItems().length>0;
		}
	
	}]); // 'displayItemsController'
	
	saveForLaterModule.directive('itemDetails', ['$templateCache', '$compile', '$timeout','$sce','templateHelper', function($templateCache,$compile, $timeout, $sce, templateHelper){
		var templateName = 'itemDetails.tpl';
		if($templateCache.get(templateName)==null){
			$templateCache.put(templateName,document.getElementById(templateName).innerHTML);
		}
		return{
			retrict: 'E',
			require: "ngModel",
			scope:{
				itemModel: '=ngModel'
			},
			controller: ["$scope",function($scope){
				var itemModel = $scope.itemModel;
				$scope.templateHelper = templateHelper.get(itemModel);
				$scope.getItems = $scope.$parent.getItems;
			}],
			link: function(scope, element, attrs, ctrl) {
				var template = $templateCache.get(templateName);
				element.append($compile(template)(scope));
				$timeout(function(){
					BH.cart.initTooltips();
				},0);
			}
		}
	}]); // itemDetails directive
	
	saveForLaterModule.directive('itemImage', ['$templateCache', '$compile', 'templateHelper', function($templateCache,$compile,templateHelper){
		var templateName = 'itemDetails.itemImage.tpl';
		if($templateCache.get(templateName)==null){
			$templateCache.put(templateName,document.getElementById(templateName).innerHTML);
		}
		return{
			retrict: 'E',
			scope: false,
			controller: ["$scope",function($scope){
				var itemModel = $scope.itemModel;
				$scope.templateHelper = $scope.$parent.templateHelper || templateHelper.get(itemModel);
			}],
			link: function(scope, element, attrs, ctrl) {
				var template = $templateCache.get(templateName);
				var compiledEl = $compile(template)(scope);
				element.append(compiledEl);
			}
		}
	}]); // itemImage directive
	
	saveForLaterModule.directive('itemInfo', ['$templateCache', '$compile', 'templateHelper', function($templateCache,$compile,templateHelper){
		var templateName = 'itemDetails.itemInfo.tpl';
		if($templateCache.get(templateName)==null){
			$templateCache.put(templateName,document.getElementById(templateName).innerHTML);
		}
		return{
			retrict: 'E',
			scope: false,
			controller: ["$scope",function($scope){
				var itemModel = $scope.itemModel;
				$scope.templateHelper = $scope.$parent.templateHelper || templateHelper.get(itemModel);
			}],
			link: function(scope, element, attrs, ctrl) {
				var template = $templateCache.get(templateName);
				var compiledEl = $compile(template)(scope);
				element.append(compiledEl);
			}
		}
	}]); // itemInfo directive
	
	saveForLaterModule.directive('itemShipInfo', ['$templateCache', '$compile', 'templateHelper', function($templateCache,$compile,templateHelper){
		var templateName = 'itemDetails.itemShipInfo.tpl';
		if($templateCache.get(templateName)==null){
			$templateCache.put(templateName,document.getElementById(templateName).innerHTML);
		}
		return{
			retrict: 'E',
			scope: false,
			controller: ["$scope",function($scope){
				var itemModel = $scope.itemModel;
				$scope.templateHelper = $scope.$parent.templateHelper || templateHelper.get(itemModel);
			}],
			link: function(scope, element, attrs, ctrl) {
				var template = $templateCache.get(templateName);
				var compiledEl = $compile(template)(scope);
				element.append(compiledEl);
			}
		}
	}]); // itemShipInfo directive	
	
	saveForLaterModule.directive('itemCtasContainer', ['$templateCache', '$compile', 'templateHelper', 'dataFactory', function($templateCache,$compile,templateHelper,dataFactory){
		var templateName = 'itemDetails.itemCTAs.buttons.tpl';
		if($templateCache.get(templateName)==null){
			$templateCache.put(templateName,document.getElementById(templateName).innerHTML);
		}
		return{
			retrict: 'E',
			scope: false,
			controller: ["$scope",function($scope){
				var itemModel = $scope.itemModel;
				$scope.templateHelper = $scope.$parent.templateHelper || templateHelper.get(itemModel);
			}],
			link: function(scope, element, attrs, ctrl) {
				var template = $templateCache.get(templateName);
				var compiledEl = $compile(template)(scope);
				element.append(compiledEl);
				
				element.on("click",".js-remove-saved-item",function(){
					dataFactory.removeItem(scope.itemModel).then(function(response){
						scope.getItems();
						BH.util.alert({
							msg: "Removed Saved Item",
							icon: '',
							timeout: 2000
						});
					},function(error){
						console.warn("error:",error);
					});
				});	
				element.on("click",".js-move-saved-item-to-wishlist",function(){
					var saveForLaterData = scope.$parent.saveForLaterData;
					dataFactory.moveToWishList(scope.itemModel).then(function(response){
						dataFactory.removeItem(scope.itemModel).then(function(response){
							BH.util.alert({
								msg: "Moved Saved Item To Wish List",
								icon: '',
								timeout: 2000
							});
							scope.getItems();
						},function(error){
							console.warn("error:",error);
						});
					},function(error){
						console.warn("Move to Wishlist Error:",error);
					});
				});
				
				element.on("click",".js-move-saved-item-to-cart",function(){
					var saveForLaterData = scope.$parent.saveForLaterData;
					dataFactory.moveToCart(scope.itemModel,saveForLaterData.id).then(function(response){
						if((BH.cart.getItems()).length>0){
							refreshCart(function(){
								BH.util.alert({
									msg: "Moved Saved Item To Cart",
									icon: '',
									timeout: 2000
								});
							});
						}else{
							document.location.reload();	
						}

					},function(error){
						console.warn("error:",error);
					});
				});
			}
		}
	}]); // itemCtasButtons directive	
	
	var isBootstrapped = false;
	function saveForLaterBootstrap(){
		var moduleEl = document.getElementById("saveForLaterModule");
		angular.bootstrap(moduleEl, ['saveForLaterModule']);
		isBootstrapped = true;
	}

	angular.element(document).ready(function() {
		if(!isBootstrapped){
			saveForLaterBootstrap();
		}
	});
	
	document.addEventListener("refresh-cart-event", function(e) {
		saveForLaterBootstrap();
	});	
})();
