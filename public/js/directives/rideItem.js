define(['./module'], function (directives) {
    'use strict';

    console.log("Init Ride tpl")
    directives.directive('rideItem', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            template: '<div><h3>Ride {{data.id}}</h3></div>'
        };
    })
});