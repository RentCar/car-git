/**
 * Created by Artem on 17.11.13.
 */

define(['./module'], function (controllers) {
    'use strict';

    console.log("Init Socket controller")
    controllers.controller('socketsCtrl', ['$scope', 'sockets', function ($scope, sockets) {

        console.log("in scope of sockets ctrl")
        console.log("might be a sockets module pt.2: ", sockets)
//        var socket = io.connect('http://94.244.155.77:3030');

        $scope.sc = 100
        $scope.user = {
            name: "Artem1",
            test: "Test1"
        }

    }]);
});