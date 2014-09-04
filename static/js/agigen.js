(function($, window, undefined){
    'use strict';

    var app = angular.module('agigenApp', []);
    app.controller('menuCtrl', ['$scope', function($scope){
        $scope.menuVisible = false;
    }])
    .controller('parallaxCtrl', ['$scope', function($scope){
        $scope.width = $(window).innerWidth()


        $scope.x = 0;
        $scope.y = 0;
        $scope.updateParallax = function($event) {
            // console.log($event.clientX, $event.clientY);
            $scope.x = $event.clientX / $scope.width;
            $scope.y = $event.clientY / $scope.width;

            $scope.x2 = $scope.x*-1;
            $scope.y2 = $scope.y*-1;

        };
    }])



    $('.animate--in-view').inView({style: 'sticky'});
}(jQuery, window));
