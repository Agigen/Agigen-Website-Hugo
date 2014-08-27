(function($, window, undefined){
    'use strict';

    var app = angular.module('agigenApp', []);
    app.controller('menuCtrl', ['$scope', function($scope){
        $scope.menuVisible = false;
    }])

    app.controller('webprodCtrl', ['$scope', function($scope) {
        $scope.done = false
    }])

    app.directive('scroll', function ($window) {
        return {
            scope: false,
            link: function(scope, element, attrs) {
                updateLine(scope)
                angular.element($window).bind("scroll", function() {
                    updateLine(scope)
                    scope.$apply()
                });
            }
        };

        function updateLine(scope) {
            var distanceFromTop = $('.section--webprod-process').offset().top - $(window).scrollTop();

            if(-distanceFromTop > -200) {
                $('.webprod-process__point--2').css({'opacity': 1});
                $('.webprod-process__step--2').css({'opacity': 1});
            }
            if(-distanceFromTop > 0) {
                $('.webprod-process__point--3').css({'opacity': 1});
                $('.webprod-process__step--3').css({'opacity': 1});
            }
            if(-distanceFromTop > 200) {
                scope.stepTwoUp = true

                $('.webprod-process__point--4').css({'opacity': 1});
                $('.webprod-process__step--4').css({'opacity': 1});
            }
            if(-distanceFromTop > 400) {
                scope.stepThreeUp = true

                $('.webprod-process__point--5').css({'opacity': 1});
                $('.webprod-process__step--5').css({'opacity': 1});
            }
            if(-distanceFromTop > 600) {
                scope.stepFourUp = true

                $('.webprod-process__point--6').css({'opacity': 1});
                $('.webprod-process__step--6').css({'opacity': 1});
            }
            if(-distanceFromTop > 800) {
                scope.stepFiveUp = true
            }
            if(-distanceFromTop > 1000) {
                scope.stepSixUp = true
                scope.done = true
                $('line').attr('y2', 118)
                $('.section--webprod-process').addClass('section--webprod-process--small')
            }

            /* Start draw that line */
            if(-distanceFromTop > -400 && !scope.done){
                if($('line').attr('y2') < -(distanceFromTop - 400)/4) {
                    $('line').attr('y2', -(distanceFromTop - 400)/4)
                }
            }
        }
    });


}(jQuery, window));