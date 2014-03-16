/**
 * Created by Artem on 15.03.14.
 */

define(['./module'], function (controllers) {
    'use strict';

    controllers.controller('showOrderCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
        $scope.id = $stateParams.id;
    }]);

});