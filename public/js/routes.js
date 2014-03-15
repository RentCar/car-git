define(['./app'], function (app) {
    'use strict';

    return app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/greeting');

        $stateProvider
            .state('driver', {
                url: '/driverForm',
                templateUrl: 'driverForm',
                controller: 'driverFormCtrl'
            })
            .state('passenger', {
                url: '/passengerForm',
                templateUrl: 'passengerForm',
                controller: 'passengerFormCtrl'
            })
            .state('def' ,{
                url: '/greeting',
                templateUrl: 'greeting'
            })
    }]);

    return app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/passengerForm', {

        });

        $routeProvider.when('/userBlock', {
            templateUrl: 'userBlock',
            controller: 'userCtrl'
        })

        $routeProvider.when('/driverForm', {
            templateUrl: 'driverForm',
            controller: 'driverFormCtrl'
        })

         $routeProvider.otherwise({

//             redirectTo: 'greeting.html'
         });
     }]);
 });