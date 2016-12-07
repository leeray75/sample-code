(function() {
	"use strict";	
	var baseUrl = BH.constants.findUrl+'static/js';
	
	define("Services",["require"],function(require){
		return BH.ShopByApp.api;
	});	

    requirejs.config({
        baseUrl: baseUrl,
        shim: {
            underscore: {
                exports: "_"
            },
            backbone: {
                deps: ["jquery","underscore"],
                exports: "Backbone"
            },
            marionette: {
                deps: ["backbone"],
                exports: "Marionette"
            }		
        }
    });

    // Start the main app logic.
	requirejs(['shopByAppPage/app'],
		function(ShopByApp) {
			$(document).ready(function(e) {
                ShopByApp.start();
            });			
		});	
})();