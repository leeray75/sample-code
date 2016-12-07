/* 
	The main cart isn't rendered with AngularJS, this is the code executed after clicking on a item's 'Save for Later'.
*/
BH.cart.saveSelectedItem = function(cartItem){
	var itemModel = {
		skuNo: cartItem.sku,
		itemSource: cartItem.is	
	}
	
	var dataFactory = angular.injector(['ng', 'saveForLaterModule']).get("dataFactory");
	dataFactory.addItem(itemModel).then(function(_data){
		var data = _data.hasOwnProperty('data') ? _data.data : _data;
		if(BH.globals.loggedIn && data.hasOwnProperty('status') && data.status.toLowerCase()!='error'){
			refreshCart(function(){
				BH.util.alert({
					msg: '1 Item Saved',
					icon: '',
					timeout: 2000
				});
			});
		}
	},function(error){
		console.warn("Save For Later Error:",error);
	});

}
