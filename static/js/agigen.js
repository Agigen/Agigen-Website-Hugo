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
    .controller('chatCtrl', ['$scope', function($scope){
        $scope.messages = [
            "Hello, what's your name?"
        ];
        $scope.connected = false;
        $scope.username = "";
        $scope.message = "";

        $scope.onConnected = function(){
            $scope.connected = true;
            $scope.messages.push("Connected!");
            $scope.$digest();
        };
        $scope.onIncomingMessage = function(msg, user) {
            $scope.messages.push(user + ": " + msg);
            $scope.$digest();
        };
        $scope.send = function(){
            if ($scope.message.indexOf('sudo') === 0) {
                $scope.messages.push("Oh come on man ;)");
                $scope.message = "";
                return;
            };

            if (!$scope.username) {
                $scope.messages.push($scope.message);
                $scope.message = "";
            };

            if ($scope.messages.length == 2) {
                $scope.username = $scope.messages[1];
                $scope.messages.push("Hi " + $scope.username + ". We're connecting you...");
            };

        };

        // example, bind this to the real class later
        window.incomingMessage = $scope.onIncomingMessage;
        window.connected = $scope.onConnected;

    }]);

    $('.start-circle').addClass('animate');


    // Category selection in blog for mobile devices
    $('.categories--mobile').on('change', function(){
        var v = $(this).val();
        window.location = v;
    });


    var animateSvgs = function(){
        var path = $('.animate--svg path').each(function(i,e){
            var path = e;
            var length = e.getTotalLength();
            // Clear any previous transition
            path.style.transition = path.style.WebkitTransition = 'none';
            // Set up the starting positions
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = length;
            // Trigger a layout so styles are calculated & the browser
            // picks up the starting position before animating
            path.getBoundingClientRect();
            // Define our transition
            path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
            // Go!
            path.style.strokeDashoffset = '0';
        });
    };
    animateSvgs();


    if ($('#map-canvas').length > 0) {
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
