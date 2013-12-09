define(['./module'], function (directives) {
    'use strict';

    console.log("Init Ride tpl")
    directives.directive('rideItem', function () {
        return {
            restrict: 'E',
            transclude: true,
//            scope: {},
            template: '<div>' +
                '<h3>Trip {{trip._id}}</h3>' +
                '<ul>' +
                '<li>From address: {{trip.points[0].address}}</li>' +
                '<li>To address: {{trip.points[1] && trip.points[1].address}}</li>' +
                '<li>Price: {{trip.dPrice}}</li>' +
                '<li>Driver: {{trip.driver.first_name}} {{trip.driver.last_name}}</li>' +
                '<li>email: {{trip.driver.email}}</li>' +
                '</ul>' +
                '</div>'
        };
    })
});