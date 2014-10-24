/**
 * Created with JetBrains RubyMine.
 * User: USCal-XJiang
 * Date: 10/15/14
 * Time: 6:54 PM
 * To change this template use File | Settings | File Templates.
 */

adAssetModule
    .factory('dataFactory', ['$http', function($http) {

        var urlBase = '/api/channels/assets';
        var dataFactory = {};

        dataFactory.getAssets = function (noItems) {
            return $http.get(urlBase+'/' + noItems);
        };

        return dataFactory;
    }]);
