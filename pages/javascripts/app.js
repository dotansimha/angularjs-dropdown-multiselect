'use strict';

angular.module('exampleApp', [
    'ngRoute',
    'angularjs-dropdown-multiselect',
    'hljs'
]).
config(['$routeProvider', '$locationProvider', '$compileProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);

        var staticPath = '/angularjs-dropdown-multiselect/';
        var appPathRoute = '/';
        var pagesPath = staticPath + 'javascripts/pages/';


        $routeProvider.when(appPathRoute + 'home', {
            templateUrl: pagesPath + 'home/home.html'
        });

        $routeProvider.otherwise({
            redirectTo: appPathRoute + 'home'
        });

    }
]);
