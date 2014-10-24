/**
 * Created with JetBrains RubyMine.
 * User: USCal-XJiang
 * Date: 10/21/14
 * Time: 3:46 PM
 * To change this template use File | Settings | File Templates.
 */


adAssetModule.controller("clipController",function($scope){
    $scope.toBeCopied = "";
    $scope.copied = false;				  //message display control

    $scope.getTextToCopy = function() {
        return $scope.toBeCopied;				 //copy the text to clipboard
    };
    $scope.displayMes = function () {
        $scope.copied = true;

    };
});

