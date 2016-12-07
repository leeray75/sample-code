(function () {
"use strict";
    define("shopByAppPage/app",
	[
		"require",
		"Services",
		"shopByAppPage/helpers",
		"shopByAppPage/router",
		"shopByAppPage/models/ShopByAppModel",
		"shopByAppPage/views/ShopByAppLayout"
	],
	function (require, Services, helpers, router, ShopByAppModel, ShopByAppLayout) {
		var App = new Backbone.Marionette.Application();
		BH.globals.isDynamicPage = true;
        App.addRegions({
			content: '#shop-by-application-app',	
		});
        // Start history when our application is ready
		
        App.on("start", function () {
			$(window).unload(function() {
				$('body').scrollTop(0); // prevent loading all products from all the categories on refreshing the page
			});
			var _root = BH.constants.findUrl.replace(document.location.origin,"")+BH.globals.currPageName;
			var shopByAppModel = null;
			var shopByAppLayout = null;
			var locationHash = document.location.hash;
			var doSuccess = function( exploraData, categoriesData ){
				if (BH.globals.isPushStateSupported){
					window.history.pushState("",categoriesData.pageTitle, categoriesData.canonicalTag+locationHash);
					locationHash = "";
				}
				$('head > title').html(categoriesData.pageTitle);
				$('link[rel="canonical]"').attr('href',categoriesData.canonicalTag);
				
				BH.Item.clean();

				var data = {
					explora: $.isArray(exploraData) ? exploraData[0] : exploraData,
					categories: categoriesData
				};
				if(shopByAppModel == null){
					shopByAppModel = new ShopByAppModel(data);
					shopByAppLayout = new ShopByAppLayout({
						model: shopByAppModel
					});
					App.content.show(shopByAppLayout);
				}
				else{
					shopByAppModel.initialize(data);
				}
			}
			var doError = function(error){
				console.error("Shop By Application Error:",error);
			}
			router.setRefreshContentPromises(doSuccess,doError);
			if (BH.globals.isPushStateSupported){
				Backbone.history.start({root: _root, pushState: true });
			}
			else{
				Backbone.history.start({root: document.location.pathname, pushState: false });
			}
			if (BH.globals.isPushStateSupported){
				App.content.$el.on('click','a',function(e){
					var targetHref = $(e.currentTarget).data('app-route');
					if(targetHref!=null){
						var params = targetHref.split(BH.globals.currPageName);
						if(params.length>1){
							e.preventDefault();
							router.navigate(params[1],{trigger: true});
						}
					}

				});
			}

        });
        return App;
    });
})();