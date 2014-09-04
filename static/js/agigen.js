var mapsApiKey = "AIzaSyDMMFeNcOLwq4vEFgc9C39sshHtkiVa6jo";

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

        var targetX, targetY, damping = 150 /* higher value = slower damping */;

        $scope.x = $scope.x2 = $scope.x3 = targetX = 0;
        $scope.y = $scope.y2 = $scope.y3 = targetY = 0;


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

    if (true) {
        window.initializeGoogleMaps = function() {
            var mapStyles = [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}];


            var mapOptions = {
                zoom: 15,
                center: new google.maps.LatLng(59.332779, 18.081026),
                styles: mapStyles,
                disableDefaultUI: true,
                backgroundColor: "#222222"
            };

            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        }

        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=initializeGoogleMaps';
        document.body.appendChild(script);
    };

    $('.animate--in-view').inView({style: 'sticky'});
}(jQuery, window));
