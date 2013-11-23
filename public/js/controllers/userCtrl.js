/**
 * Created by Artem on 16.11.13.
 */
define(['./module'], function (controllers) {
    'use strict';
    console.log("Init User controller")
    controllers.controller('userCtrl', [function ($scope) {
//        $scope.user = {
//            name : "Artem",
//            test : "test"
//        }
        this.user = {
            name: "Artem1",
            test: "Test1"
        }
//        $scope.alert = function() {
//            console.log("Method from user ctrl")
//        }
    }]);
});