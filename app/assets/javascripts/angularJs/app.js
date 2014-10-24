/**
 * Created with JetBrains RubyMine.
 * User: USCal-XJiang
 * Date: 10/15/14
 * Time: 6:51 PM
 * To change this template use File | Settings | File Templates.
 */

var adAssetModule = angular.module('adAsset', ['ngRoute','ngClipboard']);
//var adAssetModule = angular.module('adAsset', ['ngRoute']);

adAssetModule.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/', {
        controller: 'assetsController',
        templateUrl: '/app/views/temp/index.html'
    })
        .otherwise({ redirectTo: '/' });

}]);

adAssetModule.filter('searchFor', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString){

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){

            if(item.title.toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }

        });

        return result;
    };

});



