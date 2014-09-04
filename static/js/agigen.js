(function($, window, undefined){
    'use strict';

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                  window.setTimeout(callback, 1000 / 60);
              };
    })();

    var app = angular.module('agigenApp', []);
    app.controller('menuCtrl', ['$scope', function($scope){
        $scope.menuVisible = false;
    }])
    .controller('parallaxCtrl', ['$scope', function($scope){
        $scope.width = $(window).innerWidth()

        var targetX, targetY, damping = 150 /* higher value = slower damping*/;

        $scope.x = targetX = 0.5;
        $scope.y = targetY = 0.5;

        $scope.updateParallax = function($event) {
            // console.log($event.clientX, $event.clientY);
            targetX = ($event.clientX / $scope.width) * 2;
            targetY = ($event.clientY / $scope.width) * 2;
        };

        var updateParallax = function() {
            // console.log($event.clientX, $event.clientY);
            if (Math.abs(targetX - $scope.x) > 0.005 || Math.abs(targetY - $scope.y) > 0.005) {
                $scope.x = $scope.x + (targetX - $scope.x) / damping;
                $scope.y = $scope.y + (targetY - $scope.y) / damping;

                $scope.x2 = $scope.x*-1;
                $scope.y2 = $scope.y*-1;
                $scope.x3 = ($scope.x2*-1);
                $scope.y3 = ($scope.y2*-1);

                $scope.$digest();

            }

            requestAnimFrame(updateParallax);
        };

        requestAnimFrame(updateParallax);
    }])



    $('.animate--in-view').inView({style: 'sticky'});
}(jQuery, window));
