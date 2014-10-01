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
        var $cloud1 = $('.cloud-wrapper--1'),
            $cloud2 = $('.cloud-wrapper--2'),
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

        $scope.zoomLevelSthlm = 13;
        $scope.zoomLevelSweden = 7;
        $scope.zoomLevelEurope = 5;
        $scope.zoomLevelOffice = 14;
        // $scope.zoomLevelWorld = 4;
        $scope.zoom = $scope.zoomLevelEurope;
        $scope.toggleMap = function(){
            $scope.setZoom($scope.zoomLevelOffice);
            $scope.showMap = !$scope.showMap;
        };

        $scope.setZoom = function(z) {
            console.log("trying to set zoom to", z);
            if ($scope.map && $scope.zoom != z){
                $scope.zoom = z;
                $scope.map.setZoom(z);
            }
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
            var mapOptions = {
                zoom: $scope.zoom,
                center: new google.maps.LatLng(59.332779, 18.081026),
                styles: mapStyles,
                disableDefaultUI: true,
                backgroundColor: "#222222",
                scrollwheel: false
            };

            $.get("http://ipinfo.io", function(response) {
                if (response.country == "SE") {
                    console.log("Sweden set zoom to", $scope.zoomLevelSweden);
                    $scope.setZoom($scope.zoomLevelSweden)
                    var loc = response.loc.split(","),
                        sthlmBounds_ish = [59.724,59.763,20.141,20.204],
                        lat = parseFloat(loc[0]),
                        lon = parseFloat(loc[1]);
                    if (
                        (lat >= sthlmBounds_ish[0] && lat <= sthlmBounds_ish[1]) &&
                        (lon >= sthlmBounds_ish[2] && lon <= sthlmBounds_ish[3])
                    ) {
                        $scope.setZoom($scope.zoomLevelSthlm);
                    };
                }
            }, "jsonp");
            $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        }

        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=initializeGoogleMaps';
        document.body.appendChild(script);
    }])
    .controller('chatCtrl', ['$element', '$scope', '$timeout', '$http', '$interval', function($element, $scope, $timeout, $http, $interval){

        var msgAudio, typeAudio, commands, run, chat, chatRunning, ctrlKey, keys, setPrompt, pushCommandScrollback, history, historyIndex, historyBuffer, setCursorLast,
            $computer, $screen, $prompt, $promptInput, $promptWrapper;

        setPrompt = function(prompt) {
            $scope.prompt = prompt;
            $scope.updateCursorPosition();

            $timeout(function() {
                $promptInput.width($promptWrapper.width() - $prompt.width() - 2 /* random wtf */);
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
            $scope.cursorPositionLeft = step_width*(n) + 1 + $prompt.width();
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

            if ([keys.tab].indexOf($event.which) !== -1) {
                $event.preventDefault();
                return false;
            }

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
                    scrollTop: $computer.offset().top - (window.innerHeight - $computer.height()) / 2 - $('.topbar').height(),
                    translate: 100,
                }, {
                    step: function(now, tween) {
                        if (tween.prop == 'translate') {
                            // $computer.css({transform: 'translateY(' + (440 - now) + 'px)'});
                            $computer.css({
                                marginBottom: ((now/100)*440 - 440)
                            });
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
                command = $scope.promptInput.trim();
                pushCommandScrollback();

                if (command.indexOf('sudo') === 0) {
                    $scope.scrollback.push("Oh come on man ;)");
                    return;
                } else {
                    if (run(command) === 127) {
                        $scope.scrollback.push(command + ": command not found");
                    }
                }
            }
        };

        // init values
        $computer = $element;
        $screen = $element.find('.screen');
        $prompt = $element.find('.screen__prompt');
        $promptWrapper = $element.find('.screen__prompt-wrapper');
        $promptInput = $element.find('.screen__input');

        history = [];
        historyIndex = -1;

        $scope.scrollback = [];
        $scope.username = "";
        $scope.showPrompt = true;
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
            "^\\.\\/start-chat$": function() {
                    $scope.scrollback.push("Hello, what's your name?");
                    setPrompt("username:");

                    chat = new agigen.SlackChat("http://agigen-slack-chat.appspot.com");

                    chat.onConnect = function() { $scope.$apply(function() { $scope.onConnected(); }); };
                    chat.onClose = function() { $scope.$apply(function() { $scope.onClosed(); }); };
                    chat.onMessage = function(message) { $scope.onIncomingMessage(message); };
                },
            "^\\.\\/do-dragon$": function() {
                    var interval;

                    $scope.showPrompt = false;
                    $scope.scrollback.push('.');
                    interval = $interval(function() {
                        $scope.scrollback[$scope.scrollback.length - 1] += '.';
                    }, 250);

                    $http.get('http://dev.agigen.se/dragon/')
                        .success(function(response) {
                            $timeout(function() {
                                $interval.cancel(interval);
                                $scope.showPrompt = true;
                                $scope.scrollback.push(response);
                                $timeout(function() {
                                    $promptInput.focus();
                                    $scope.updateCursorPosition();
                                });
                            }, 3000);
                        });
                },
            "^ls$": function() {
                    $scope.scrollback.push('-r-xr-xr-x   do-dragon');
                    $scope.scrollback.push('-r--r--r--   readme.txt');
                    $scope.scrollback.push('-r-xr-xr-x   start-chat');
                },
            "^help$": function() {
                    $scope.scrollback.push("Sorry bro, you're on your own...");
                },
            "^cat(\\s+([\\w._\\-\\:]+)$)?": function(matches) {
                    if (matches[2] === 'readme.txt') {
                        $scope.scrollback.push("Hello there!\
\
Seems you know your way around the basic things at least ;) Why not say hi to us using the chat?\
./start-chat");
                    } else if (matches[2] === 'start-chat') {
                        $scope.scrollback.push("H?\$H??$?H?\$H??$?H?\$ H??$?H?\$(H??$?H?\$0H??$?H?\$pH?+H?,$H?<$?\
H?$??f?H?D$pH?(H???H????H?(H??????GH?(H?,$??H??$?H?D$pH???$H??$?H?$H?LH??$?H?\$?C}??H?\$H??$?H?\$ H??$?H??$81?????H??$8H????H??$?HǄ$?HǄ$H?$ ?=H??$?H?\?N??H?\$H??$?H??H?H?H??$?H?$H??$?H?\?<??H??$?H?\$\H??H??H??H?H?H?% -_H?,$H??H??H?H?H?D$H??$?H?\$H??$H?\$ ?7?H?D$pH?(H?,$H?<$tH?$???H??XÉ%??????H?(H?,$H?<$?H?$?谕HǄ$ HǄ$(Ƅ$0H?$`q<H?\$pH??khH?lH??$ H?\$赺??H??$?H??$ H??$?H??$(H??$?H??$0??$?H1?H????H?\$pH??kPH?,$H??$?H?\????H?D$H?t$H?\$ H??$?H??H??$?uKH?XH??duAH?\$pH??kPH?,$H??$?H?\蝫??H?D$H?t$H??$?H?\$ H??$?H1?H9?tH????L?D$pM?I?hHH???H?D$HH1?H9?ttH??$?H????H?H??$?H?H??$?H???{H?$H?LH?,%?DRL?D$L??H??H?H??dx??H??$?H?D$HH?\$ ???:H1ɈL$;H????H?\$pH?+H?,$??H?T$HH??$???H?Zp???}H??$?H?mH?]p???cH?ZH????RH?$?n<?L8??H?L$pH?\H?\$H?(H?l$hH?H?l$xH?hH?HH?\$PH?C0H?\$xH?????|$;uyL?I?hX@????L?L?$?H?L$pH?l@????H??<??H?)L?EL?$L?L?D?????H?l$@????H??H?l$x?]H?%@?cH??H??H??H?H?H?H?\$HH??H??$?H??$H??$?H??$H?$?q<H??$?H?\H??H?\$?M???H?\$hH?1?H9?tP?$?????H?\H?\$XH?$H?l$hL?EL?DH?l$=H?l$?V???H?\$??tuH?\$xH?l$=@?+H?\$pH??+H?,$H??$?H?\H?D$?????H?\$xH???????H?\$pH?+H?,$??H?\$xH???????H??X?H?l$XH?,$H?l$pH?\$x??X???H?\$XH?$?g???t\
                        H1??h???H1??)?????u????????H?\$x?????H??$????`???WH?x8H?<$H?%`EWH?|H??H?H??M??H?L$H??$?H?D$ H??$?H???H?\
       $H?DH?,%`=SL?D$L??H??H?H???s??H?\$ ????H?t$HH?~8H?<$H?4%`EWH?|H?H??SN??H?t$HH?~8H?<$H?4% ?TH?|H?H??0N??H?\$HH?CP????H?$??J?4??H?LH??H???_1??%???H?\$HH???BH?k@L?L??H??H?H?H?L$`H?%??H1?H9???H?L$`H?\$\HH????H??$?H?C@H??$?H?KHH?$??M?{3??H?T$HH?LH??H????1?荱??H??t}H?j@L?L??H??H?H?H?L$PH?%??H1?H9?t,H?L$PH??tH??$?H?B@H??$?H?JH?h??????H?$?");
                    } else if (matches[2] === 'do-dragon') {
                        $scope.scrollback.push("%H?D$?H;w\
                              ?8?#?????H??L??$?H??$?1?????H?%@?QH?+H?l$8H?H?l$@I????I?hH?l$(I?h H?l$0I?H1?H9???I?(H?,$?SAL??$?H?TH?D$H?T$8H?D$@I????I?I?@H??u[H?T$HH?$H?D$PH?DH?,% \FSL?D$L??H??H?H??0???L??$?H?\$ ??tH?%@?QH?+H?l$(H?H?l$0H?%@?cH?l$XH??H???h???H?\$8H?\$XH?|$@H?|$`I??tDI?H?|$hH??H?H?H?\$(H?\$xH?t$0H??$?H?t$XH??$?H??????H?Ĉ?A??A?????A?????eH?\
                                                                                                                  %H;!w轵????H??H?D$ H?D$(H?D$0H?H1?H9?t%H?(H?,$?    H?LH?D$H?L$(H?D$0H???H?hH?l$(H?h \H?l$0H???eH?\
                                                                                        %H;!w?=?????H??@H?D$PH?D$XH?\$HH????H?KH?k H?L$0H?\
                  $H?l$8H?l????H?T$0H?L$8H?\$??t<H?$H?LH?%?RH?l$H??H??H?H??LhH?D$ H?L$8H9?rH?T$0H??H?T$PH?L$XH??@??A???\
                                                                                                                       ??r???eH?\
        %H?D$?H;w\
                 ?@?#?????H??HǄ$?HǄ$?H?|$X1?芽??H?\$XH???H?\$@H?D$HH?D$PH?$ ?=H??$?H?\????H?\$H?|$@H??H?H?H?$ ?=H??$?H?\H?D????H?\$H?|$@H??H??H?H?H?$ ?=H??$?H?\H?D ???H?D$@H?\$H??H?? \H??H?H?H?%`1TH?,$H??H??H?H?H?D$H?\$HH?\$H?\$PH?\$ ?T???H?L$(H?D$0H??$?H??$?H?ĈÉ?????eH?\
                              %H;!w???????H??H?\$H?$H?<$tOH?$??\
?H?D$H???@?l$H?$H?<$tH?$???H?\$?\$ H??É%?ۉ%?eH?\
                                               %H;!w?M?????H??(H?\$0H??t!H?K8H?k@H?l$ H?,$H?L$H?Y ??H??(É??eH?\
                                                                                                              %H??$(???H;w???????H??XH?$??N?=??H?DH?D$pH??$`H?(H?$?e=??<??H?\H?\$xH?\$x?H?\$xH???[H?\$\pH??kPH?,$H?D?T");
                    } else {
                        $scope.scrollback.push("cat: " + matches[2] + ": No such file or directory");
                    }

                },
            "^shutdown(\\s+)-h(\\s+)now$": function() {
                    $scope.scrollback.push("the system will shut down NOW!");
                    $timeout(function() {
                        $('<div>').css({
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            background: '#000',
                            display: 'none',
                            zIndex: 9001,
                        }).appendTo('body').fadeIn();
                    }, 1000);
                },
            "^shutdown(\\s+)-h$": function() {
                    $scope.scrollback.push("the system will shut down in 30 seconds");
                    $timeout(function() {
                        run('shutdown -h now');
                    }, 30000);
                },
        };

        run = function(command) {
            var r;
            for (var key in commands) {
                r = new RegExp(key);
                if (r.test(command)) {
                    commands[key](command.match(r));
                    return 0;
                };
            }

            return 127;
        };

        keys = {
            'delete':   8,
            'tab':      9,
            'enter':   13,
            'shift':   16,
            'ctrl':    17,
            'alt':     18,
            'esc':     27,
            'left':    37,
            'up':      38,
            'right':   39,
            'down':    40,
            'c':       67,
            'lcmd':    91,
            'rcmd':    93,
        };

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

    if (/ip(ad|hone|od)/gi.test(navigator.userAgent)) {
        $('html').addClass('device device--ios');
    }

    $('.animate--in-view').inView({style: 'sticky'});
}(jQuery, window));
