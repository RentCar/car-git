define(['./app'], function (app) {
    'use strict';

    return app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/passengerForm', {
            templateUrl: 'passengerForm',
            controller: 'passengerFormCtrl'
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
             redirectTo: '/passengerForm'
         });
     }]);
 });