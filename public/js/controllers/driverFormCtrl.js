/**
 * Created by Artem on 28.11.13.
 */

define(['./module', 'ngAutocomplete'], function (controllers) {
    'use strict';

    console.log("Init DriverForm controller")

    controllers.controller('driverFormCtrl', ['$scope', 'socket', function ($scope, socket) {

//    $scope.result1 = '';
//    $scope.options1 = null;
//    $scope.details1 = '';


    $scope.results = '';

    $scope.result2 = '';
    $scope.options2 = {
        country: 'ca',
        types: '(cities)'
    };    $scope.details2 = '';



//    $scope.result3 = '';
//    $scope.options3 = {
//        country: 'gb',
//        types: 'establishment'
//    };
//    $scope.details3 = '';

    $scope.offer = function() {
        console.log($scope.driver)
        socket.emit('driverForm', { data: $scope.driver });
    }


    }]);
});