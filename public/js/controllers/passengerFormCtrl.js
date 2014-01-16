/**
 * Created by Artem on 16.11.13.
 */
define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('passengerFormCtrl', ['$scope', 'socket', function ($scope, socket)  {

        socket.on('tripSavingError', function(data) {
            console.log(data)
        })
    }]);
});