/**
 * Created with JetBrains RubyMine.
 * User: USCal-XJiang
 * Date: 10/21/14
 * Time: 3:46 PM
 * To change this template use File | Settings | File Templates.
 */


adAssetModule.controller("clipController",['$scope','$timeout',function($scope,$timeout){
    $scope.toBeCopied = "";
    $scope.copied = false;				  //message display control
    $scope.buttonCss = true;

    $scope.getTextToCopy = function() {
        return $scope.toBeCopied;				 //copy the text to clipboard
    };
    $scope.displayMes = function () {
        $scope.copied = true;
        $scope.buttonCss = false;
        $timeout(function(){
            $scope.copied = false;
        }, 1500);

//        setTimeout(function () {
//            $scope.$apply(function () {
//                $scope.copied = false;
//            });
//        }, 1500);        //working code  with $scope.$apply as reference.

    };
}]);

