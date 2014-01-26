define(['./module'], function (directives) {
    'use strict';

    var tpl = directives.directive;

    tpl('rideItem', function () {
        return {
            restrict: 'E',
            transclude: true,
//            scope: {},
            templateUrl: '/views/rideItem.html'
        };
    });

    tpl('userInfo', function() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/views/userInfo.html'
//            controller: userInfoCtrl // TODO: create controller
        }
    })
});