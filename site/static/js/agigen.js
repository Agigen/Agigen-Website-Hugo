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

    var breakpoints = {
        lapStart: 601,
        deskStart: 1024,
        deskWideStart: 1200,
    };

    var app = angular.module('agigenApp', ['ngTouch']);
    app.controller('menuCtrl', ['$scope', '$timeout', function($scope, $timeout){
        var $container = $('.main-header'),
            $topbar = $('.topbar'),
            checkTopbarScroll;

        checkTopbarScroll = function(v) {
            if (window.innerWidth >= breakpoints.lapStart) {
                $topbar.css({
                    paddingTop: Math.max(20, Math.min(60, 60 - v / 6))
                });

                $topbar.toggleClass('topbar--filled', v > ($container.outerHeight() - (70)));
            } else {
                $topbar.css({
                    paddingTop: 10
                });
                $topbar.toggleClass('topbar--filled', v > ($container.outerHeight() - (60)));
            }
        };

        $scope.$watch('scrollTop', checkTopbarScroll);

        $scope.menuVisible = false;
        $scope.menuVisible2 = false;
        $scope.menuVisibleTimeout = false;

        $scope.menuKeyup = function($event) {
            if ($event.which === 27) {
                $scope.menuVisible = false;
            }
        };

        $scope.toggleMenu = function() {
            //pushState
            $scope.menuVisible = !$scope.menuVisible;
        }

        $scope.$watch('menuVisible', function(menuVisible) {
            if (menuVisible) {
                $scope.menuVisibleTimeout = $timeout(function() {
                    $scope.menuVisible2 = true;
                }, 370);
            } else {
                $timeout.cancel($scope.menuVisibleTimeout);
                $scope.menuVisible2 = false;
            }
        });
    }])
    .controller('introCtrl', ['$scope', function($scope) {
        var $cloud1 = $('.could-wrapper--1'),
            $cloud2 = $('.could-wrapper--2'),
            $container = $('.main-header--start');

        $scope.$watch('scrollTop', function(v) {
            if (typeof v !== 'undefined') {
                $cloud1.css({
                    transform: 'translateY(' + -v/12 + 'px)'
                });

                $cloud2.css({
                    transform: 'translateY(' + -v/9 + 'px)'
                });

                $container.css({
                    backgroundPosition: 'center ' + -v/6 + 'px',
                });
            }
        });
    }])
    .controller('parallaxCtrl', ['$scope', '$element', function($scope, $element){
        var isIe = $('html').hasClass('browser-ie');
        $scope.width = window.innerWidth;

        var targetX, targetY, damping = 150 /* higher value = slower damping */;

        $scope._x = $scope.x = $scope.x2 = $scope.x3 = targetX = 0;
        $scope._y = $scope.y = $scope.y2 = $scope.y3 = targetY = 0;
        $scope.scrollOffset = 0;

        $scope.$watch('scrollTop', function(scrollTop) {
            var h;
            if (typeof scrollTop !== 'undefined') {
                h = Math.min(Math.max(0, (scrollTop + window.innerHeight) - $element.offset().top), $element.offset().top + $element.height());

                $scope.scrollOffset = h / ($element.offset().top + $element.height());
            }
        });

        $scope.$watch('_x', function(_x) {
            $scope.x = _x;
            $scope.x2 = $scope.x*2*-1;
            $scope.x3 = $scope.x*8*-1;
        });

        $scope.$watchGroup(['_x', '_y', 'scrollOffset'], function(values) {
            var _x = values[0],
                _y = values[1],
                scrollOffset = values[2];

            $scope.x = _x;
            $scope.x2 = $scope.x*2*-1;
            $scope.x3 = $scope.x*8*-1;

            $scope.y = _y + (scrollOffset * 2 - 1);
            $scope.y2 = $scope.y*2*-1;
            $scope.y3 = $scope.y*8*-1;
        });

        $scope.updateParallax = function($event) {
            if (isIe) {return;}

            // console.log($event.clientX, $event.clientY);
            targetX = ($event.clientX / $scope.width) * 2 - 1;
            targetY = ($event.clientY / $scope.width) * 2 - 1;
        };

        var updateParallax = function() {
            // console.log($event.clientX, $event.clientY);
            if (Math.abs(targetX - $scope._x) > 0.005 || Math.abs(targetY - $scope._y) > 0.005) {
                $scope._x = $scope._x + (targetX - $scope._x) / damping;
                $scope._y = $scope._y + (targetY - $scope._y) / damping;

                $scope.$digest();

            }

            requestAnimFrame(updateParallax);
        };

        requestAnimFrame(updateParallax);
    }])
    .controller('contactmapCtrl', ['$scope', function($scope){
        $scope.showMap = false;
        $scope.showMapLabel = function(){
            return $scope.showMap ? 'Hide map' : 'Show map';
        };
        window.initializeGoogleMaps = function() {
            var mapStyles = [
                {"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]},
                {
                    "elementType": "labels",
                    "stylers": [
                        { "visibility": "off" }
                    ]
                }
           ];


            var zoomLevelSthlm = 13,
               zoomLevelSweden = 7,
               zoomLevelEurope = 5,
               zoomLevelWorld = 4,
               zoom = zoomLevelEurope;

            function setZoom(z) {
                zoom = z;
                if (map){
                    map.setZoom(z);
                }
            };

            $.get("http://ipinfo.io", function(response) {
                if (response.country == "SE") {
                    setZoom(zoomLevelSweden)
                    var loc = response.loc.split(","),
                        sthlmBounds_ish = [59.724,59.763,20.141,20.204],
                        lat = parseFloat(loc[0]),
                        lon = parseFloat(loc[1]);
                    if (
                        (lat >= sthlmBounds_ish[0] && lat <= sthlmBounds_ish[1]) &&
                        (lon >= sthlmBounds_ish[2] && lon <= sthlmBounds_ish[3])
                    ) {
                        setZoom(zoomLevelSthlm);
                    };
                }
            }, "jsonp");

            var mapOptions = {
                zoom: zoom,
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
    }])
    .controller('chatCtrl', ['$scope', '$timeout', '$http', function($scope, $timeout, $http){

        var msgAudio, typeAudio, commands, chat, chatRunning, ctrlKey, keys, setPrompt, pushCommandScrollback, history, historyIndex, historyBuffer, setCursorLast,
            $computer, $screen, $prompt, $promptInput;

        setPrompt = function(prompt) {
            $scope.prompt = prompt;
            $scope.updateCursorPosition();

            $timeout(function() {
                $('.screen__input').width($('.screen__prompt-wrapper').width() - $('.screen__prompt').width() - 2 /* random wtf */);
            }, 0);
        };

        pushCommandScrollback = function() {
            historyIndex = -1;
            history.unshift($scope.promptInput);

            $scope.scrollback.push($scope.prompt + ' ' + $scope.promptInput);
            $scope.promptInput = "";
        };

        setCursorLast = function() {
            if ($scope.promptInput) {
                $timeout(function() {
                    $promptInput.get(0).setSelectionRange($scope.promptInput.length, $scope.promptInput.length);
                    $scope.updateCursorPosition();
                }, 0);
            }
        };

        $scope.kill = function() {
            $scope.scrollback.push("^C");
            $scope.promptInput = "";

            if (chat) {
                setPrompt("$");
                chat.disconnect();
                chat = null;
                $scope.username = "";
            }
        }

        $scope.updateCursorPosition = function(){
            var n = parseInt($promptInput.get(0).selectionStart, 10),
                step_width = 8.4;
            $scope.cursorPositionLeft = step_width*(n) + 1 + $('.screen__prompt').width();
        };

        $scope.keyUp = function($event){
            $scope.updateCursorPosition();

            if ([keys.up, keys.down].indexOf($event.which) !== -1) {
                return false;
            }

            if ($event.which == keys.ctrl) {
                ctrlKey = false;
                return;
            }
        };

        $scope.keyDown = function($event){
            var ignoreKeys = [
                keys.delete,
                keys.tab,
                keys.enter,
                keys.shift,
                keys.ctrl,
                keys.alt,
                keys.esc,
                keys.left,
                keys.up,
                keys.right,
                keys.down,
                keys.lcmd,
                keys.rcmd,
            ];

            if ($event.which === keys.ctrl) {
                ctrlKey = true;
                return;
            }

            if (ctrlKey && $event.which === keys.c) {
                $scope.kill();
                return;
            }

            if (!chat && $event.which === keys.up) {
                if (historyIndex === -1) {
                    historyBuffer = $scope.promptInput;
                }

                if (historyIndex < history.length) {
                    historyIndex++;
                }

                $scope.promptInput = history[historyIndex];

                setCursorLast();

                return false;
            }

            if (!chat && $event.which === keys.down) {
                if (historyIndex === -1) {
                    historyBuffer = $scope.promptInput;
                }

                if (historyIndex > -1) {
                    historyIndex--;
                }

                if (historyIndex > -1) {
                    $scope.promptInput = history[historyIndex];
                } else {
                    $scope.promptInput = historyBuffer;
                }

                setCursorLast();

                return false;
            }

            var type;
            if (typeAudio && ignoreKeys.indexOf($event.which) === -1) {
                type = typeAudio.cloneNode();
                type.play();
            }

            $scope.updateCursorPosition();
        };

        $scope.onConnected = function(){
            $scope.scrollback.push("Connected! Chat away with us!");
            $scope.updateCursorPosition();
        };

        $scope.onClosed = function(){
            $scope.scrollback.push("Connection lost! :(");
            $scope.updateCursorPosition();
        };

        $scope.onIncomingMessage = function(msg) {
            var uhoh;
            $scope.scrollback.push(msg.username + ": " + msg.text);
            $scope.updateCursorPosition();
            $scope.$digest();
            if (msgAudio && msg.username !== $scope.username) {
                uhoh = msgAudio.cloneNode();
                uhoh.play();
            }
        };

        $scope.send = function(){
            var command;

            if($scope.promptInput == '') {
                return;
            }

            if ($scope.scrollback.length === 0) {
                $('html, body').animate({
                    scrollTop: $computer.offset().top - 440 - (window.innerHeight - $computer.height()) / 2,
                    translate: 440,
                }, {
                    step: function(now, tween) {
                        if (tween.prop == 'translate') {
                            $computer.css({transform: 'translateY(' + (440 - now) + 'px)'});
                        }
                    },
                    duration: 500
                });
            }

            if (chat) {
                if (!$scope.username) {
                    // Connect user
                    $scope.username = $scope.promptInput;
                    $scope.scrollback.push($scope.prompt + ' ' + $scope.promptInput);
                    $scope.promptInput = "";

                    $scope.scrollback.push("Hi " + $scope.username + ". We're connecting you...");
                    chat.connect($scope.username);

                    setPrompt(">");
                } else {
                    // Send message
                    chat.send($scope.promptInput);
                    $scope.promptInput = "";
                }
            } else {
                command = $scope.promptInput;
                pushCommandScrollback();

                if (command.indexOf('sudo') === 0) {
                    $scope.scrollback.push("Oh come on man ;)");
                    return;
                } else if (typeof commands[command] === 'function') {
                    commands[command]();

                } else {
                    $scope.scrollback.push(command + ": command not found");
                }
            }
        };

        // init values
        $computer = $('.computer');
        $screen = $('.screen');
        $prompt = $('.screen__prompt');
        $promptInput = $('.screen__input');

        history = [];
        historyIndex = -1;

        $scope.scrollback = [];
        $scope.username = "";
        $scope.promptInput = "./start-chat";

        setPrompt("$");

        if (typeof Audio === 'function') {
            msgAudio = new Audio('/audio/icq.mp3');
            msgAudio.preload = 'auto';
            msgAudio.load();
            typeAudio = new Audio('/audio/type.mp3');
            typeAudio.preload = 'auto';
            typeAudio.load();
        }

        ctrlKey = false;
        commands = {
            './start-chat': function() {
                    $scope.scrollback.push("Hello, what's your name?");
                    setPrompt("username:");

                    chat = new agigen.SlackChat("http://agigen-slack-chat.appspot.com");

                    chat.onConnect = function() { $scope.$apply(function() { $scope.onConnected(); }); };
                    chat.onClose = function() { $scope.$apply(function() { $scope.onClosed(); }); };
                    chat.onMessage = function(message) { $scope.onIncomingMessage(message); };
                },
            './do-dragon': function() {
                    $http.get('http://dev.agigen.se/dragon/')
                        .success(function(response) {
                            $scope.scrollback.push(response);
                        });
                },
            'ls': function() {
                    $scope.scrollback.push('-r-xr-xr-x   do-dragon');
                    $scope.scrollback.push('-r-xr-xr-x   start-chat');
                },
            'help': function() {
                    $scope.scrollback.push("Sorry bro, you're on your own...");
                },
        };
        keys = {
            delete:   8,
            tab:      9,
            enter:   13,
            shift:   16,
            ctrl:    17,
            alt:     18,
            esc:     27,
            left:    37,
            up:      38,
            right:   39,
            down:    40,
            c:       67,
            lcmd:    91,
            rcmd:    93,
        }

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
                    scope.$apply();
                };

                var updateScroll = _updateScroll;
                $window.on('scroll.scroll-spy', updateScroll);

                $timeout(function() { updateScroll(); }, 0);
            }
        };
    }])
    .directive('workVideo', [function() {
        return {
            restrict: 'A',
            transclude: true,
            template: '\
<div class="work-video__video">\
    <div class="inline-block two-thirds lap-four-fifths palm-one-whole">\
        <div class="media media--16-9"></div>\
    </div>\
</div>\
<div class="work-video__content" ng-transclude></div>\
',
            link: function(scope, element, attrs) {
                var content = element.find('.work-video__content'),
                    video = element.find('.work-video__video'),
                    embed = element.find('.media'),
                    contentHeight, videoHeight;

                element.addClass('work-video');

                if (attrs.workVideo) {
                    element.addClass('work-video--' + attrs.workVideo);
                }

                scope.playing = false;

                scope.play = function() {
                    if (scope.playing) {
                        return;
                    }

                    scope.playing = true;

                    contentHeight = content.outerHeight();
                    videoHeight = embed.outerHeight();

                    element.height(contentHeight);
                    content.fadeOut(800, function() {
                        $('body, html').animate({scrollTop: $(window).scrollTop() + (videoHeight - contentHeight) / 2});
                        element.animate({height: videoHeight}, function() {
                            video.fadeTo(800, 1);

                            if (attrs.embedYoutube) {
                                var div = $('<div>');
                                embed.append(div);

                                scope.player = new YT.Player(div.get(0), {
                                    height: '',
                                    width: '',
                                    videoId: attrs.embedYoutube,
                                    playerVars: { 'autoplay': 1 },
                                });
                            }
                        });
                    });
                };
            }
        };
    }])
    .directive('screenCarousel', ['$interval', function($interval) {
        return {
            restrict: 'A',
            scope: true,
            template: '\
<div class="screen-carousel-bevel screen-carousel-bevel--{{screenType}}">\
    <ul class="screen-carousel" ng-swipe-left="swipeLeft()" ng-swipe-right="swipeRight()">\
        <li ng-repeat="src in srcs track by $index" class="screen-carousel__item"\
            ng-click="setSlide($index)"\
            ng-class="{\
                \'screen-carousel__item--current\': $index == index,\
                \'screen-carousel__item--prev\': $index == (index - 1),\
                \'screen-carousel__item--next\': $index == (index + 1),\
                \'screen-carousel__item--below\': $index < index,\
                \'screen-carousel__item--over\': $index > index,\
            }"\
        >\
            <img ng-src="{{src}}">\
            <div class="raster"></div>\
        </li>\
    </ul>\
</div>\
<nav>\
    <ul class="screen-carousel-nav">\
        <li ng-repeat="src in srcs track by $index" class="screen-carousel-nav__item"\
            ng-class="{\
                \'screen-carousel-nav__item--current\': $index == index,\
            }"\
        >\
            <a ng-click="setSlide($index)">Item {{$index}}</a>\
        </li>\
    </ul>\
</nav>\
            ',
            link: function(scope, element, attrs) {
                scope.screenType = (attrs.screenType == 'mobile' ? 'mobile' : 'desktop');
                element.addClass('screen-carousel-wrapper');
                scope.srcs = attrs.screenCarousel.split(',');
                scope.index = scope.srcs.length > 2 ? 1 : 0;

                scope.setSlide = function(index) {
                    scope.index = index;
                };

                scope.swipeLeft = function() {
                    if (scope.index < scope.srcs.length - 1) {
                        scope.index++;
                    }
                };

                scope.swipeRight = function() {
                    if (scope.index > 0) {
                        scope.index--;
                    }
                };
            },
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

    $(document).one('touchstart.touchdetect', function() {
        $('html').addClass('touch-device');
    });

    $('.animate--in-view').inView({style: 'sticky'});
}(jQuery, window));
