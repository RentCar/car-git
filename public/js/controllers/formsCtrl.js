/**
 * Created by Artem on 28.11.13.
 */

define(['./module'], function (controllers) {
    'use strict';

    /**
     * Passenger Form
     */
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


    /**
     * Driver Form
     */
    controllers.controller('driverFormCtrl', ['$scope', 'socket', function ($scope, socket) {

        $scope.driver = {
            startpoint: {},
            destination: {}
        };

        var orderCallback = function(data) {
            console.log("Order Saved", data);
            $scope.$apply(function() {
                $scope.driver = {};
            });
        }

        $scope.offer = function() {
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

    // TODO: remove
    controllers.controller('ModalDemoCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {


        var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

            $scope.items = items;
            $scope.selected = {
                item: $scope.items[0]
            };

            $scope.ok = function () {
                $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };



        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function () {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);


    // TODO: move somewhere
    controllers.controller('MapCtrl', ['$scope', function ($scope) {
        $scope.mapOptions = {
            center: new google.maps.LatLng(35.784, -78.670),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
//        google.maps.event.trigger(map, "resize");

    }]);



    controllers.controller('headerCtrl', ['$scope', function($) {
        $.loginMenuState = 'hide'

        // menu api
        $.showLoginMenu = function() {
            $.loginMenuState = 'show'
        }
    }]);

});