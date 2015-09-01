'use strict';

var myApp = angular.module('myApp', [
    'ngRoute',
    'myApp.dashboard',
    'ui.bootstrap'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/scenarios'});
    }]);





