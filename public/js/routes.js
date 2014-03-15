define(['./app'], function (app) {
    'use strict';

    return app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/greeting');

        $stateProvider
            .state('driver', {
                url: '/driverForm',
                views: {
                    left: {
                        templateUrl: 'driverForm',
                        controller: 'driverFormCtrl'
                    },
                    right: {
                        templateUrl: 'results',
                        controller: 'searchResultsCtrl'
                    }
                }
            })
            .state('passenger', {
                url: '/passengerForm',
                views: {
                    left: {
                        templateUrl: 'passengerForm',
                        controller: 'passengerFormCtrl'
                    },
                    right: {
                        templateUrl: 'results',
                        controller: 'searchResultsCtrl'
                    }
                }
            })
            .state('order', {
                url: '/order/:id',
                views: {
                    left: {
                        templateUrl: 'order',
                        controller: function($scope, $stateParams) {
                            $scope.id = $stateParams.id;
                        }
                    }
                }
            }).state('order.info', {
                url: '/info',
                template: 'Order Info'
            }).state('order.save', {
                url: '/save',
                template: 'Order SAVING'
            }).state('order.del', {
                url: '/del',
                template: 'Order delete'
            })
            .state('def' ,{
                url: '/greeting',
                views: {
                    left: {
                        templateUrl: 'greeting'
                    }
                }
            })
    }]);
 });