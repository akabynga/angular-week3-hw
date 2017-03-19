(function () {
	'use strict';


	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.controller('FoundItemsDirectiveController', FoundItemsDirectiveController)
	.service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItemsDirective);

	function FoundItemsDirective() {
		var ddo = {
			templateUrl: 'templates/foundItems.html',
			scope: {
				items: '<',
				onRemove: '&',
				inProgress: '<',
				message: '@message'
			},
			controller: FoundItemsDirectiveController,
			controllerAs: 'list',
			bindToController: true
		};
		return ddo;
	};

	function FoundItemsDirectiveController (){
		var list = this;
	};


	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController (MenuSearchService){
		var narrowItDownCtrl = this;

		narrowItDownCtrl.message = "";
		narrowItDownCtrl.searchTerm;
		narrowItDownCtrl.foundItems  = [];
		narrowItDownCtrl.inProgress = false;

		narrowItDownCtrl.getMatchedMenuItems = function(searchTerm){

			narrowItDownCtrl.message = "";
			narrowItDownCtrl.inProgress = true;
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
				narrowItDownCtrl.foundItems = foundItems;
				if(foundItems.length == 0){
					narrowItDownCtrl.message = "Nothing is found!";
				}
				narrowItDownCtrl.inProgress = false;
				
			}).catch(function(error){
				console.error(error);
				narrowItDownCtrl.inProgress = false;
			});

		};

		narrowItDownCtrl.removeItem = function (itemIndex) {
			narrowItDownCtrl.foundItems.splice(itemIndex, 1);
		};

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