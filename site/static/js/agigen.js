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
            $topbarWrapper = $('.topbar-wrapper'),
            checkTopbarScroll;

        checkTopbarScroll = function(v) {
            if (window.innerWidth >= breakpoints.lapStart) {
                $topbarWrapper.css({
                    paddingTop: Math.max(0, Math.min(45, 45 - v / 6))
                });

                $topbar.toggleClass('topbar--filled', v > ($container.outerHeight() - (70)));
            } else {
                $topbarWrapper.css({
                    paddingTop: 0
                });
                $topbar.toggleClass('topbar--filled', v > ($container.outerHeight() - (60)));
            }
        };

        $scope.$watch('scrollTop', checkTopbarScroll);

        $scope.menuVisible = false;
        $scope.menuVisible2 = false;
        $scope.menuVisibleTimeout = false;

        $scope.topbarCompensation = 0;

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
                var topbarWidthBeforeOpeningMenu = $topbar.width();
                $scope.menuVisibleTimeout = $timeout(function() {
                    $scope.menuVisible2 = true;
                    $timeout(function() {
                        $scope.topbarCompensation = $topbar.width() - topbarWidthBeforeOpeningMenu;
                    }, 0);
                }, 370);
            } else {
                $timeout.cancel($scope.menuVisibleTimeout);
                $scope.menuVisible2 = false;
                $scope.topbarCompensation = 0;
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
        var isIe = $('html').hasClass('browser--ie');
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

        $scope.mapStyles = [
            {"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]},
            {
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" }
                ]
            }
        ];
        $scope.mapStylesWithLabels = [
            {"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]},
            {
                "elementType": "labels",
                "stylers": [
                    { "visibility": "on" }
                ]
            }
        ];

        $scope.agigenOfficeMarker;
        $scope.zoomLevelSthlm = 13;
        $scope.zoomLevelSweden = 7;
        $scope.zoomLevelEurope = 5;
        $scope.zoomLevelOffice = 14;
        // $scope.zoomLevelWorld = 4;
        $scope.zoom = $scope.zoomLevelEurope;
        $scope.toggleMap = function(){
            $scope.showMap = !$scope.showMap;
            if ($scope.showMap) {
                // showing map
                $scope.setZoom($scope.zoomLevelOffice);
                $scope.map.setOptions({styles: $scope.mapStylesWithLabels});
                $scope.agigenOfficeMarker.setVisible(true);
            } else {
                // hiding map
                $scope.map.setOptions({styles: $scope.mapStyles});
                $scope.agigenOfficeMarker.setVisible(false);
            }
        };

        $scope.setZoom = function(z) {
            // console.log("trying to set zoom to", z);
            if ($scope.map && $scope.zoom != z){
                $scope.zoom = z;
                $scope.map.setZoom(z);
            }
        };

        window.initializeGoogleMaps = function() {
            var mapOptions = {
                zoom: $scope.zoom,
                center: new google.maps.LatLng(59.332779, 18.081026),
                styles: $scope.mapStyles,
                disableDefaultUI: true,
                backgroundColor: "#222222",
                scrollwheel: false
            };
            $.get("http://ipinfo.io", function(response) {
                if (response.country == "SE") {
                    // console.log("Sweden set zoom to", $scope.zoomLevelSweden);
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
            $scope.agigenOfficeMarker = new google.maps.Marker({
                position: new google.maps.LatLng(59.332779,18.081026),
                map: $scope.map,
                title: 'Agigen Office',
                icon: {
                    url: '/img/contact/location_agigen.png',
                    scaledSize: new google.maps.Size(32, 50),
                    size: new google.maps.Size(64, 100),
                    anchor: new google.maps.Point(0, 32),
                    origin: new google.maps.Point(0,0)
                },
                visible: false
            });
            window.map = $scope.map;
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
                $promptInput.width($promptWrapper.width() - $prompt.width() - 12 /* random wtf */);
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
                $scope.scrollback.push("^C");
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

                    if (['/quit', '/wc', '/exit'].indexOf($scope.promptInput) !== -1) {
                        $scope.scrollback.push($scope.prompt + ' ' + $scope.promptInput);
                        $scope.kill();
                    } else {
                        // Send message
                        chat.send($scope.promptInput);
                        $scope.promptInput = "";
                    }
                }
            } else {
                command = $scope.promptInput.trim();
                pushCommandScrollback();

                if (run(command) === 127) {
                    $scope.scrollback.push(command + ": command not found");
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
            "^sudo(\\s(.*))?$": function(matches) {
                if (matches[2] === 'bash') {
                    $scope.scrollback.push("ehehehe");
                } else {
                    $scope.scrollback.push("Oh come on man ;)");
                }
            },
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
    .controller('slackCaseMap', ['$scope', function($scope){
        var mapStyles = [
            {
            "featureType": "administrative",
            "stylers": [
            { "visibility": "off" }
            ]
            },{
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
            { "visibility": "off" }
            ]
            },{
            "featureType": "road",
            "stylers": [
            { "visibility": "off" }
            ]
            },{
            "featureType": "landscape.man_made",
            "stylers": [
            { "visibility": "off" }
            ]
            },{
            "featureType": "poi",
            "stylers": [
            { "visibility": "off" }
            ]
            },{
            "featureType": "landscape",
            "stylers": [
            { "color": "#ffc683" }
            ]
            },{
            "featureType": "water",
            "stylers": [
            { "color": "#f4a543" }
            ]
            },{
            "featureType": "administrative.country",
            "elementType": "labels",
            "stylers": [
            { "visibility": "off" }
            ]
            },{
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
            { "color": "#ffffff" },
            { "visibility": "simplified" }
            ]
            }
        ];

        $scope.agigenOfficeMarker;

        $scope.slackCountries = [
            {code: 'AE', name: "United Arab Emirates", position: [24.466667, 54.366667]},
            {code: 'AU', name: "Australia", position: [-35.282000, 149.128684]},
            {code: 'AR', name: "Argentina", position: [-34.603723, -58.381593]},
            {code: 'AW', name: "Aruba", position: [12.519000, -70.037]},
            {code: 'BE', name: "Belgium", position: [50.850340, 4.35171]},
            {code: 'BR', name: "Brazil", position: [-14.235004, -51.92528]},
            {code: 'BY', name: "Belarus", position: [53.904540, 27.561524]},
            {code: 'CA', name: "Canada", position: [45.421530, -75.697193]},
            {code: 'CL', name: "Chile", position: [-33.469120, -70.641997]},
            {code: 'CH', name: "Switzerland", position: [46.947922, 7.444608]},
            {code: 'CO', name: "Colombia", position: [4.598056, -74.075833]},
            {code: 'CZ', name: "Czech Republic", position: [50.075538, 14.4378]},
            {code: 'DE', name: "Germany", position: [52.520007, 13.404954]},
            {code: 'DK', name: "Denmark", position: [55.676097, 12.568337]},
            {code: 'DO', name: "Dominican Republic", position: [18.466667, -69.95]},
            {code: 'ES', name: "Spain", position: [40.416775, -3.70379]},
            {code: 'FI', name: "Finland", position: [60.173324, 24.941025]},
            {code: 'FR', name: "France", position: [48.856614, 2.352222]},
            {code: 'GB', name: "United Kingdom", position: [51.507351, -0.127758]},
            {code: 'GR', name: "Greece", position: [37.983917, 23.72936]},
            {code: 'GU', name: "Guam", position: [13.470891, 144.751278]},
            {code: 'HU', name: "Hungary", position: [47.497912, 19.040235]},
            {code: 'HR', name: "Croatia", position: [45.815011, 15.981919]},
            {code: 'IN', name: "India", position: [28.613939, 77.209021]},
            {code: 'IT', name: "Italy", position: [41.902783, 12.496366]},
            {code: 'JP', name: "Japan", position: [35.689487, 139.691706]},
            {code: 'KR', name: "South Korea", position: [37.566535, 126.977969]},
            {code: 'LB', name: "Lebanon", position: [33.888629, 35.495479]},
            {code: 'LK', name: "Sri Lanka", position: [6.894070, 79.902478]},
            {code: 'LV', name: "Latvia", position: [56.949649, 24.105186]},
            {code: 'NL', name: "Netherlands", position: [52.370216, 4.895168]},
            {code: 'NO', name: "Norway", position: [59.913869, 10.752245]},
            {code: 'NP', name: "Nepal", position: [27.700000, 85.333333]},
            {code: 'NZ', name: "New Zealand", position: [-41.286460, 174.776236]},
            {code: 'PK', name: "Pakistan", position: [33.729388, 73.093146]},
            {code: 'PL', name: "Poland", position: [52.229676, 21.012229]},
            {code: 'PH', name: "Philippines", position: [14.599512, 120.984219]},
            {code: 'RU', name: "Russia", position: [55.755826, 37.6173]},
            {code: 'RO', name: "Romania", position: [44.426767, 26.102538]},
            {code: 'RS', name: "Serbia", position: [44.786568, 20.448922]},
            {code: 'SE', name: "Sweden", position: [59.332779,18.081026]},
            {code: 'SK', name: "Slovakia", position: [48.145892, 17.107137]},
            {code: 'SV', name: "El Salvador", position: [13.692940, -89.218191]},
            {code: 'TN', name: "Tunisia", position: [36.806495, 10.181532]},
            {code: 'TR', name: "Turkey", position: [39.920770, 32.85411]},
            {code: 'UA', name: "Ukraine", position: [50.450100, 30.5234]},
            {code: 'US', name: "United States", position: [38.907192, -77.036871]},
            {code: 'UZ', name: "Uzbekistan", position: [41.266667, 69.216667]},
            {code: 'VN', name: "Vietnam", position: [21.027764, 105.83416]},
            {code: 'ZA', name: "South Africa", position: [-25.746111, 28.188056]}
        ];

        window.initializeGoogleMapsSlack = function() {
            var mapOptions = {
                zoom: 3,
                center: new google.maps.LatLng(20.594194, 13.183594),
                styles: mapStyles,
                disableDefaultUI: true,
                backgroundColor: "#F4A542",
                scrollwheel: false,
                draggable: true,
                disableDoubleClickZoom: true
            };

            $scope.map = new google.maps.Map(document.getElementById('slack-map'), mapOptions);

            var circle = {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#ffffff',
                fillOpacity: 0,
                scale: 8,
                strokeColor: '#ffffff',
                strokeWeight: 2
            };
            var circleFilled = {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#ffffff',
                fillOpacity: 1,
                scale: 8,
                strokeColor: '#ffffff',
                strokeWeight: 2
            };

            for (var i = 0; i < $scope.slackCountries.length; i++) {
                var country = $scope.slackCountries[i];
                if (country.position && country.position.length) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(country.position[0],country.position[1]),
                        map: $scope.map,
                        title: country.name,
                        icon: circle
                    });
                    google.maps.event.addListener(marker, 'mouseover', function() {
                        this.setIcon(circleFilled);
                        var name = this.title;
                        $scope.$apply(function(){
                            $scope.country = name;
                        });
                    });
                    google.maps.event.addListener(marker, 'mouseout', function() {
                        this.setIcon(circle);
                        $scope.$apply(function(){
                            $scope.country = false;
                        });
                    });
                }
            }

        }

        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=initializeGoogleMapsSlack';
        document.body.appendChild(script);
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
    .directive('carousel', ['$interval', function($interval) {
        return {
            restrict: 'A',
            scope: true,
            template: '\
<div class="carousel-bevel carousel-bevel--{{bevel}}">\
    <ul class="carousel" ng-swipe-left="swipeLeft()" ng-swipe-right="swipeRight()">\
        <li ng-repeat="src in srcs track by $index" class="carousel__item"\
            ng-click="setSlide($index)"\
            ng-class="{\
                \'carousel__item--current\': $index == index,\
                \'carousel__item--prev\': $index == (index - 1),\
                \'carousel__item--next\': $index == (index + 1),\
                \'carousel__item--below\': $index < index,\
                \'carousel__item--over\': $index > index,\
            }"\
        >\
            <img ng-src="{{src}}">\
            <div class="raster"></div>\
        </li>\
    </ul>\
</div>\
<nav>\
    <ul class="carousel-nav">\
        <li ng-repeat="src in srcs track by $index" class="carousel-nav__item"\
            ng-class="{\
                \'carousel-nav__item--current\': $index == index,\
            }"\
        >\
            <a ng-click="setSlide($index)">Item {{$index}}</a>\
        </li>\
    </ul>\
</nav>\
            ',
            link: function(scope, element, attrs) {
                scope.bevel = attrs.bevel ? attrs.bevel : 'desktop';
                element.addClass('carousel-wrapper');
                scope.srcs = attrs.carousel.split(',');
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


    setTimeout(function(){
        $('.start-circle').addClass('animate');
    }, 10);

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
        $('html').addClass('device device--touch');
    });

    $('.animate--in-view').inView({style: 'sticky'});
}(jQuery, window));
