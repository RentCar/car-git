/**
 * Created by Artem on 28.11.13.
 */

define(['./module'], function (controllers) {
    'use strict';

    console.log("Init DriverForm controller")
    controllers.controller('driverFormCtrl', ['$scope', 'socket', function ($scope, socket) {

    $scope.offer = function() {
        console.log($scope.driver)
        socket.
        socket.emit('driverForm', { data: $scope.driver });
    }


    }]);
});