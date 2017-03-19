(function () {
	'use strict';


	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.controller('ShoppingListDirectiveController', ShoppingListDirectiveController)
	.service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItemsDirective);
	function FoundItemsDirective() {
		var ddo = {
			templateUrl: 'foundItems.html',
			scope: {
				items: '<',
				onRemove: '&'
			}
		};
		return ddo;
	};

	function ShoppingListDirectiveController (){
		var list = this;
	};


	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController (MenuSearchService){
		var narrowItDownCtrl = this;

		narrowItDownCtrl.searchTerm;
		narrowItDownCtrl.items  = [];

		narrowItDownCtrl.getMatchedMenuItems = function(searchTerm){
			var promise = MenuSearchService.getMatchedMenuItems();

			promise.then(function (result) {
				var allItems = result.data.menu_items;
				var foundItems = [];
				for(var i = 0; i < allItems.length; i++){
					var item = allItems[i];
					if(item.description.indexOf(searchTerm) > - 1 || item.name.indexOf(searchTerm) > -1){
						foundItems.push(item);
					}
				}
				narrowItDownCtrl.items = foundItems;

			}).catch(function(error){
				console.error("Something goes wrong!");
			});

		};

		narrowItDownCtrl.removeItem = function (itemIndex) {
			items.splice(itemIndex, 1);
		};

		MenuSearchService.getMatchedMenuItems().then(function (result) {
			narrowItDownCtrl.items = result.data.menu_items;
		});

	};

	MenuSearchService.$inject = ['$http'];
	function MenuSearchService ($http){

		var service = this;

		var URL_MENU = "https://davids-restaurant.herokuapp.com/menu_items.json";

		service.getMatchedMenuItems = function(){
			return $http({url: URL_MENU});
		};

	};
})();