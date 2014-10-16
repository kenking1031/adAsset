/**
 * Created with JetBrains RubyMine.
 * User: USCal-XJiang
 * Date: 10/15/14
 * Time: 6:53 PM
 * To change this template use File | Settings | File Templates.
 */

adAssetModule.controller('assetsController', ['$scope', 'dataFactory',
    function($scope, dataFactory){

        getAssets();

        function getAssets(){
            if(localStorage['data']){

                var data= JSON.parse(localStorage['data']);
                $scope.assets = data.assets;
                $scope.message = data.message;
                $scope.total_assets = data.total_assets;
                $scope.sort = {
                    column: '',
                    descending: ''
                };

            } else{
            dataFactory.getAssets(3)
                .success(function (data) {
                    localStorage['data'] = JSON.stringify(data);
                    $scope.assets = data.assets;
                    $scope.message = data.message;
                    $scope.total_assets = data.total_assets;
                    $scope.sort = {
                        column: '',
                        descending: ''
                    };
                })
                .error(function (error) {
                    $scope.status = 'Unable to load assets data: ' + error.message;
                });
            }
        }

        $scope.changeSorting = function(column) {


            var sort = $scope.sort;

            if (sort.column == column) {
                sort.descending = !sort.descending;

                if(column=='title'){
                    $scope.directionTitle = !$scope.directionTitle;

                }   else{
                    $scope.directionTime = !$scope.directionTime;
                }


            } else {
                if(column == 'title'){
                    sort.column = column;
                    sort.descending = false;
                    $scope.directionTitle = true;
                    $scope.directionTime = '';

                }else{
                    sort.column = column;
                    sort.descending = false;
                    $scope.directionTime = true;
                    $scope.directionTitle = '';

                }

            }


        };

        $scope.firePopup = function(){

            $('body').css('overflow','hidden');
            $('#fancybox').css({'left':($(window).width()-800)/2,'top': ($(window).height()-475)/2+$(window).scrollTop()});

            $('#overlay').fadeIn('fast');
            $scope.layerIn('#fancybox',200);
            streamURL =this.asset.play_url;
        } ;

        $scope.closePopup = function(){

            $('body').css('overflow','auto');
            $('#fancybox').fadeOut('fast');
            $scope.layerOut('#overlay',200);
        }

        $scope.layerIn = function(layerId,timePeriod){
            var performFunction = function(){
                $(layerId).fadeIn('fast');
            };

            setTimeout( performFunction(), timePeriod );
        }
        $scope.layerOut = function(layerId,timePeriod){
            var performFunction = function(){
                $(layerId).fadeOut('fast');
            };

            setTimeout( performFunction(), timePeriod );
        }

    }]);
