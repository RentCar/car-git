define([
    'angular',
    'angular-route',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index'

    ], function (ng, ngRoute) {
        'use strict';
    return ng.module('app', [
        'ngRoute',
        'app.services',
        'app.filters',
        'app.directives',
        'app.controllers'
        ]);
});