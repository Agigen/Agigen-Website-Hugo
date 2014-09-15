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
    .controller('introCtrl', ['$scope', function($scope) {
        var $cloud1 = $('.could-wrapper--1'),
            $cloud2 = $('.could-wrapper--2'),
            $container = $('.main-header--start');

        $scope.$watch('scrollTop', function(v) {
            if (typeof v !== 'undefined') {
                $cloud1.css({
                    transform: 'translateY(' + -v/5 + 'px)'
                });

                $cloud2.css({
                    transform: 'translateY(' + -v/3 + 'px)'
                });

                $container.css({
                    backgroundPosition: '0px ' + v/6 + 'px',
                })
            }
        });
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

                $scope.x2 = $scope.x*2*-1;
                $scope.y2 = $scope.y*1*-1;
                $scope.x3 = $scope.x*8*-1;
                $scope.y3 = $scope.y*3*-1;

                $scope.$digest();

            }

            requestAnimFrame(updateParallax);
        };

        requestAnimFrame(updateParallax);
    }])
    .controller('chatCtrl', ['$scope', '$timeout', function($scope, $timeout){
        var msgAudio = new Audio('/audio/icq.mp3'),
            typeAudio = new Audio('/audio/type.mp3');
        $scope.messages = [
            "Hello, what's your name?"
        ];
        $scope.connected = false;
        $scope.username = "";
        $scope.message = "";
        $scope.lastMessage = "";
        $scope.lastSentMessage = "";
        $scope.url = "http://agigen-slack-chat.appspot.com";
        $scope.keyDown = function(){
            typeAudio.pause();
            typeAudio.currentTime = 0;
            typeAudio.play();
        };
        $scope.onConnected = function(){
            $scope.connected = true;
            $scope.messages.push("Connected!");
            $scope.pulse()
        };
        $scope.onIncomingMessage = function(msg, user) {
            $scope.messages.push(user + ": " + msg);
            $scope.$digest();
            msgAudio.play();
        };
        $scope.pulse = function() {
            var url = $scope.url
            $.get(url, function(content) {
                var data = JSON.parse(content)
                if($scope.lastMessage != data.message && data.message != "None") {
                    if(data.message != $scope.lastSentMessage) {
                        $scope.lastMessage = data.message
                        $scope.onIncomingMessage(data.message, data.from)
                    }
                }
            });
            $timeout($scope.pulse, 2500);
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
                // Connect user
                $scope.username = $scope.messages[1];
                var data = {
                    'username': $scope.username
                };
                $scope.messages.push("Hi " + $scope.username + ". We're connecting you...");
                $.ajax({
                    url: $scope.url + '/api/connect',
                    type: 'POST',
                    data: data
                }).done(function(data) {
                    $scope.onConnected()
                });

            };

            if ($scope.messages.length > 2) {
                if($scope.message == '') {
                    return;
                }
                // Send message
                var data = {
                    'username': $scope.username,
                    'text': $scope.message
                };

                $.ajax({
                    url: $scope.url + '/api/sendmessage',
                    type: 'POST',
                    data: data
                }).done(function(data) {
                    $scope.messages.push($scope.username + ": " + $scope.message)
                    $scope.lastSentMessage = $scope.message;
                    $scope.message = "";
                    $scope.lastMessage = "";
                    $scope.$digest();
                });
            }

        };

        // example, bind this to the real class later
        window.incomingMessage = $scope.onIncomingMessage;
        window.connected = $scope.onConnected;

    }])
    .directive('scrollSpy', ['$timeout', function($timeout) {
        /*
        Keeps track of the current scroll position and updates the scope accordingly
        */
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var $window = $(window);

                var _updateScroll = function(event) {
                    scope.scrollTop = $window.scrollTop();
                    console.log(scope.scrollTop);
                    scope.$apply();
                };

                var updateScroll = _updateScroll;
                $window.on('scroll', updateScroll);

                $timeout(function() { updateScroll(); }, 0);
            }
        };
    }]);

    $('.start-circle').addClass('animate');

    $('.main-header__video').on('canplay', function(){
        $('.main-header__video').addClass('main-header__video--loaded');
    })


    // Category selection in blog for mobile devices
    $('.categories--mobile').on('change', function(){
        var v = $(this).val();
        window.location = v;
    });

    // visually count up to a number
    $('.count-up').each(function(i,e){
        var $e = $(e);
        var val = $e.text();
        $e.data('count_to', val);
        $e.text('0');
        var countUp = function(){
            var current = parseInt($e.text(), 10),
                next = current + 1,
                max = parseInt($e.data('count_to'), 10);
            if (next > max) {
                clearInterval(interval);
                return;
            }
            $e.text(next);
        };
        var interval = setInterval(countUp, 70);
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
                backgroundColor: "#222222",
                scrollwheel: false

            };

            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        }

        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=initializeGoogleMaps';
        document.body.appendChild(script);
    };

    $('.animate--in-view').inView({style: 'sticky'});
}(jQuery, window));
