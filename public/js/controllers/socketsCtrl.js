/**
 * Created by Artem on 17.11.13.
 */

define(['./module'], function (controllers) {
    'use strict';

    console.log("Init Socket controller")
    controllers.controller('socketsCtrl', ['$scope', 'socket', function ($scope, socket) {

        console.log("in scope of sockets ctrl")
        console.log("might be a sockets module pt.2: ", socket)
//        var socket = io.connect('http://94.244.155.77:3030');

        $scope.sc = 100
        $scope.user = {
            name: "Artem1",
            test: "Test1"
        };

        $scope.socketData = [{
            name: 'Test',
            test: 'bred'
        }, {
            name: 'Test2',
            test: 'bred2'
        }];

        $scope.addUser = function() {
            $scope.socketData.push({
                name: $scope.newUsername,
                test: new Date().getDate()
            })
        }

        socket.on("userData", function(data) {
//            $scope.socketData.push({})
//            angular.forEach(data.data.user, function(value, key){
//                console.log(data.data.user)
//                $scope.socketData[$scope.socketData.length -1][key] = value; // or $scope.list[key] = value;
//            });
            $scope.$apply(function () {
                $scope.socketData.push(angular.fromJson(data.data.user));
            });

            console.log($scope.socketData)
        })

    }]);
});