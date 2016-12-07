(function () {
"use strict";
    define("shopByAppPage/helpers",
	["require"],
	function (require) {
		var helpers = {
			getUrlParamValue: function(url,name){
				var paramValue;
				/* Get value from seo friendly url */
				if(url.indexOf("/"+name+"/")>-1){
					var urlSplit = url.split("/"+name+"/");
					var paramsArray = urlSplit[1].split("/");
					paramValue = paramsArray[0];
				}
				/* Get value from query string */
				else{
					name = name.replace(/[\[\]]/g, "\\$&");
					var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
					var results = regex.exec(url);
					if (!results){
						 return null;
					}
					else if (!results[2]){
						 return '';
					}
					else{
						paramValue = results[2];
					}
				}
				return decodeURIComponent(paramValue.replace(/\+/g, " "));
			},
			lazyLoadModule: function(moduleView){
				var deferred = jQuery.Deferred();
				var eventName = 'scroll.'+moduleView.cid;
				var scrollTimeout = null;
				function isReady(){
					return $(window).scrollTop() + $(window).height() > moduleView.$el.offset().top+(moduleView.$el.height()/4);	
				}
				if (isReady()) {	
					deferred.resolve();
				}
				else{
					 $(window).off(eventName).on(eventName,(function(e) {
						clearTimeout(scrollTimeout);
						setTimeout(function(){
							if (isReady()) {
								$(window).off(eventName);
								deferred.resolve();
							}
						},200);
					}));
				}
				return deferred.promise();
			},
			initSmoothDivScroll: function($viewEl){
				var options = {
					hiddenOnStart: false,
					setupComplete: function(eventObj){
						var arrowSvgHtml = '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-down-light"></use></svg>';
						$viewEl.find('.scrollingHotSpotLeft').addClass("disabled").attr("data-selenium","scrollLeft");
						$viewEl.find('.scrollingHotSpotRight').attr("data-selenium","scrollRight");
						$viewEl.find('.scrollingHotSpotLeft').append(arrowSvgHtml);
						$viewEl.find('.scrollingHotSpotRight').append(arrowSvgHtml);
						$viewEl.removeClass('not-ready').addClass('visible');
					}
				}
				$viewEl.find('.smooth-div-scroll-container').smoothDivScroll(options);
			}
		}
        return helpers;
    });
})();