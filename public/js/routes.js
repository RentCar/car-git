define(['./app'], function (app) {
    'use strict';
    return app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'views/test.html',
            controller: 'userCtrl'
        });

        $routeProvider.when('/view2', {
             templateUrl: 'test2.html',
             controller: 'elseCtrl'
         });

         $routeProvider.otherwise({
             redirectTo: '/view1'
         });
     }]);
 });