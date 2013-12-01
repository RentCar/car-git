/**
 * Created by Artem on 28.11.13.
 */

define(['./module'], function (controllers) {
    'use strict';

    console.log("Init DriverForm controller")

    controllers.controller('driverFormCtrl', ['$scope', 'socket', function ($scope, socket) {

        $scope.driver = {
            startpoint: {},
            destination: {}
        };

        var location = (function() {
            var l = {};
            // default config for autocomplete
            l.ac = {
                startpoint : {
                    result: '',
                    options: '',
                    details: ''
                },
                destination : {
                    result: '',
                    options: '',
                    details: ''
                }
            }
            // current geolocation
            function getLocation() {
                if (navigator.geolocation) {
                    return navigator.geolocation.getCurrentPosition(showPosition);
                } else {
                    console.log("No geolocation, get Chrome")
                }
            }
            function showPosition(position)  {
                console.log("Latitude: " + position.coords.latitude +
                    "|| Longitude: " + position.coords.longitude)
                return(position)
            }

            l.getCurrentPosition = getLocation
            return l
        }());

        $scope.driver.startpoint.ac = location.ac.startpoint;
        $scope.driver.destination.ac = location.ac.destination;

        $scope.driver.geoposition = location.getCurrentPosition();

        $scope.offer = function() {

            console.log($scope.driver)
            socket.emit('driverForm', { data: $scope.driver });
        }
        $scope.locateMe = location.getCurrentPosition

    }]);
});