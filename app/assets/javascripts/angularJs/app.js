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



