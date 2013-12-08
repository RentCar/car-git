/**
 * Created by Artem on 08.12.13.
 */

define(['./module'], function (controllers) {
    'use strict';

    /**
     * Controller for search result of both drivers and passengers
     * @param $scope
     * @param socket
     */
    controllers.controller('searchResultsCtrl', ['$scope', 'socket', function ($scope, socket) {

        // rides list
        $scope.trips = []; // array of:
//        $scope.trips.push(
//                { from: {
//                    x: 30.45770600000003,
//                    y: 50.423683,
//                    address: 'Воздухофлотский проспект, Киев, город Киев, Украина',
//                    _id: '52a4bc5253d586ef2c000002',
//                    __v: 0 },
//                    to: {
//                        x: 30.493136999999933,
//                        y: 50.447864,
//                        address: 'Цирк, Київ, місто Київ, Україна',
//                        _id: '52a4bc5253d586ef2c000003',
//                        __v: 0 },
//                    driver: {
//                        first_name: 'Sergey',
//                        last_name: 'Abyrvalg',
//                        gender: true,
//                        email: 's.lozhechnikov@astoundcommerce.com',
//                        timezone: 2,
//                        _id: '5295b7d3355ff12c10000002',
//                        __v: 0,
//                        karma: 0,
//                        social: [ [Object] ] },
//                    dPrice: 123,
//                    _id: '52a4bc5253d586ef2c000004',
//                    __v: 0,
//                    date: '1386527792982'
//                });

        // debug fx
        $scope.logTrips = function() {
            console.log($scope.trips);
        }

        // Loading all trips for current user
        socket.on("onReceiveTrips", function(data) {
            $scope.$apply(function () {
                $scope.trips = data
            });
        });

        // Adding new trips in live
        socket.on("onNewTrip", function(data) {
            $scope.$apply(function () {
                $scope.trips.push(data)
            });
        })
    }]);
});