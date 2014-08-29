(function($, window, undefined){
    'use strict';

    var app = angular.module('agigenApp', []);
    app.controller('menuCtrl', ['$scope', function($scope){
        $scope.menuVisible = false;
    }])


}(jQuery, window));