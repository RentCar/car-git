/**
 * Created by Artem on 28.11.13.
 */

define(['./module'], function (controllers) {
    'use strict';

    console.log("Init DriverForm controller")

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

    controllers.controller('MapCtrl', ['$scope', function ($scope) {
        $scope.mapOptions = {
            center: new google.maps.LatLng(35.784, -78.670),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    }]);



    controllers.controller('headerCtrl', ['$scope', function($) {
        $.loginMenuState = 'hide'
        $.test = [
            1,2,3,4,5,6,7,8,9
        ]

        // menu api
        $.showLoginMenu = function() {
            $.loginMenuState = 'show'
        }
    }]);

    controllers.controller('passengerOrderCtrl', ['$scope', 'socket', function($, socket) {
        $.users = [{
            name: "User1",
            info: "test1"
        },{
            name: "User2",
            info: "test2"
        },{
            name: "User3",
            info: "test3"
        }]
    }]);

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
            function getLocation() {                                           //TODO: It needs to be readeble, also a lot of logic is the same as in passanger ctrl so it can be reused
                if (navigator.geolocation) {
                    return navigator.geolocation.getCurrentPosition(showPosition);
                } else {
                    console.log("No geolocation, get Chrome")
                }
            }
            function showPosition(position)  {
				socket.emit("sendLocation", [position.coords.latitude, position.coords.longitude]);
                console.log("Latitude: " + position.coords.latitude +
                    "|| Longitude23: " + position.coords.longitude);
                return(position)
            }

            l.getCurrentPosition = getLocation
            return l
        }());

        $scope.driver.startpoint.ac = userLocation.ac.startpoint;
        $scope.driver.destination.ac = userLocation.ac.destination;

        $scope.driver.geoposition = userLocation.getCurrentPosition();

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
        $scope.locateMe = userLocation.getCurrentPosition

    }]);
});