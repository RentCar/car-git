define([
    'angular',
    'angular-route',
//    'ngAutocomplete',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index'

    ], function (ng, ngRoute) {
        'use strict';
    return ng.module('app', [
        'ngRoute',
//        'ngAutocomplete',
        'app.services',
        'app.filters',
        'app.directives',
        'app.controllers'
        ]);
});