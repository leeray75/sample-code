(function () {
"use strict";

    define("shopByAppPage/router",
	[
		"require",
		"Services",
		"shopByAppPage/helpers"
	],
	function (require, Services, helpers) {
		var refreshSuccess,refreshError;
		var _routes = {};
		var currPath = "";
		_routes["*path"] = "refreshContent";
		var AppRouter = Backbone.Router.extend({
			routes: _routes,
			refreshContent: function(path){
				var hasPath = path!=null;
				if(hasPath && !BH.globals.isPushStateSupported && ("#"+path == document.location.hash)){
					hasPath = false;	
				}
				
				path = hasPath ? "/"+path : document.location.pathname;

				var nValue = helpers.getUrlParamValue(path,"N");
				var ciValue = helpers.getUrlParamValue(path,"ci");
				
				if (hasPath && !BH.globals.isPushStateSupported){
					if(nValue!=null && nValue.length>0 && ciValue!=null && ciValue.length>0){
						var index = document.location.pathname.indexOf(BH.globals.currPageName);
						var href = document.location.pathname.substring(0,index+BH.globals.currPageName.length);
						href+="/ci/"+ciValue+"/N/"+nValue;
						document.location.replace(href);
					}
				}
				else if(currPath.length==0 || path.indexOf(document.location.pathname)<0){
					currPath = path;
					var exploraApi = Services.getExploraData(ciValue);
					var categoryApi = Services.getCategories(nValue,ciValue);
					$.when( exploraApi, categoryApi ).then(refreshSuccess,refreshError);

				}
			}

		});

		var router = new AppRouter();
		router.setRefreshContentPromises = function(_success,_error){
			refreshSuccess = _success,
			refreshError = _error
		}
        return router;
    });
})();
