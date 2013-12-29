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

        var userLocation = (function() {
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
            };
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
                    "|| Longitude: " + position.coords.longitude);
                return(position)
            }

            l.getCurrentPosition = getLocation
            return l
        }());

        $scope.driver.startpoint.ac = userLocation.ac.startpoint;
        $scope.driver.destination.ac = userLocation.ac.destination;

        $scope.driver.geoposition = userLocation.getCurrentPosition();

        $scope.offer = function() {
            socket.emit('driverForm', {
                geoposition: $scope.driver.geoposition || {x:0, y:0},
                points :[{
					origin: $scope.driver.startpoint.origin,
					address: $scope.driver.startpoint.ac.result,
					geopoints: {
						lat : $scope.driver.startpoint.ac.details.geometry.userLocation.lat(),
						lng : $scope.driver.startpoint.ac.details.geometry.userLocation.lng()
					}
				},
				{
                    origin: $scope.driver.destination.origin,
                    address: $scope.driver.destination.ac.result,
                    geopoints: {
						lat : $scope.driver.destination.ac.details.geometry.userLocation.lat(),
						lng : $scope.driver.destination.ac.details.geometry.userLocation.lng()
					}
   
                }],
				price: $scope.driver.price,
				date : $scope.driver.date
            });
        };
        $scope.locateMe = userLocation.getCurrentPosition

    }]);
});