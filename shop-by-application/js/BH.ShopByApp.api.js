(function () {
	"use strict";
	window.BH = window.BH || {};
	window.BH.ShopByApp = window.BH.ShopByApp || {}
	window.BH.ShopByApp.api = 
	(function () {
		return {
			getBestSellersProducts: function(_appParams){
				var _params ={
					Q: "json",
					ipp: 8,
					Ns: "p_POPULARITY%7c1",
					/* setIPP: 8, */
					pn: 1
				}
				_.extend(_params,_appParams);
				return BH.ajax.call({
					api: "endecaSearch",
					params: _params
				});	
				
			},
			getCategories: function(_N,_ci){
				var _params ={
					Q: 'json',
					N: _N,
					ci: _ci,
					app: 'sba'
				}
				var cacheKey = "ShopApp.Categories."+_N+"."+_ci;
				return BH.ajax.call({
					api: "endecaCategory",
					params: _params,
					cache: {
						key: cacheKey,
						maxAge: 60 * 60
					}
				});	
			},
			getCategoryProducts: function(_N,_ci){
				_N = _N.replace(/ /g,'+');
				var _params ={
					Q: 'json',
					N: _N,
					ipp: 6,
					ipb: 2
				}

				if(typeof(_ci)!='undefined'){
					_params.ci = _ci;
				}
				
				return BH.ajax.call({
					api: "GetQuickEndecaSearch",
					params: _params						
				});	
				
			},
			getExploraData: function(_ci){
				var cacheKey = "SBA-"+_ci;
				var _data ={
					ci: _ci
				}
				var _settings = {
					method: "GET",
					type: "GET",
					data: _data
				}
				var _url = document.location.hostname.indexOf("localhost")>-1 ? "/explora/api/bnh/sba/get" : "//"+BH.constants.exploraBaseUrl+"/api/bnh/sba/get";
				return BH.ajax.call({
					url: _url,
					ajaxSettings: _settings,
					cache: {
						key: cacheKey,
						maxAge: 60 * 60
					}
				});	
			}
		} // end return
	})(); // end BH.ShopByApp.api
})();