define([
    'angular',
    'ui-bootstrap',
//    'angular-route',
    'ui-router',
    'ui-utils',
    'ui-map',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index'
    ], function (ng) {
        'use strict';
        return ng.module('app', [
            'ui.router',
            'app.services',
            'app.filters',
            'app.directives',
            'app.controllers',
            'ui.bootstrap',
            'ui.utils',
            'ui.map'
        ]);
});