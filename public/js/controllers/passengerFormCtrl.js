/**
 * Created by Artem on 16.11.13.
 */
define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('passengerFormCtrl', ['$scope', 'socket', function ($scope, socket)  {

        $scope.driver = {
            startpoint: {},
            destination: {}
        };

        var orderCallback = function(data) {
            console.log("Order Saved", data);
            $scope.$apply(function() {
                $scope.driver = {};
            });
        };

        $scope.offer = function() {

            console.log("Offer click!!!")
            return;

            console.log($scope.driver.startpoint.ac.details.geometry);
            socket.emit('createOrder', {
                geoposition: $scope.driver.geoposition || {x:0, y:0},
                points :[{
                    origin: $scope.driver.startpoint.origin,
                    address: $scope.driver.startpoint.ac.result,
                    geopoints: {
                        lat : $scope.driver.startpoint.ac.details.geometry.location.lat(),
                        lng : $scope.driver.startpoint.ac.details.geometry.location.lng()
                    }
                },
                    {
                        origin: $scope.driver.destination.origin,
                        address: $scope.driver.destination.ac.result,
                        geopoints: {
                            lat : $scope.driver.destination.ac.details.geometry.location.lat(),
                            lng : $scope.driver.destination.ac.details.geometry.location.lng()
                        }

                    }],
                price: $scope.driver.price,
                date : $scope.driver.date
            });
            socket.on("orderSaved", function(data) {
                if(data.failed) {
                    console.warn(data.reason, data.err || "")
                } else {
                    orderCallback(data);
                }
            })
        };

    }]);
});