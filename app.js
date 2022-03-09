(function() {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItems);

  function FoundItems() {
    var ddo = {
      templateUrl: 'item.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
  //    controller: FoundItemsController,
  //  controllerAs: 'list',
  //  bindToController: true
    };

    return ddo;
  }



  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var nidctrl = this;
    nidctrl.found = [];

      nidctrl.getMatchedMenuItems = function () {
      nidctrl.found = []
      if (nidctrl.searchTerm) {
        var promise = MenuSearchService.getMatchedMenuItems(nidctrl.searchTerm);

        promise.then(function (result) {
          nidctrl.found = result;
        });
      }
    };


    nidctrl.removeItem = function (index) {
      nidctrl.found.splice(index, 1);
    }
  };


  MenuSearchService.$inject = ['$http', 'ApiBasePath']
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json"),
      }).then(function (result) {

        var returnedMenuItems = result.data.menu_items;
        var foundItems = []
        for (var i = 0; i < returnedMenuItems.length; i++) {
          if (returnedMenuItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
            foundItems.push(returnedMenuItems[i]);
          }
        }

        // return processed items
        return foundItems;
      });
    };

  };

})();
