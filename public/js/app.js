define([
    'angular',
    'ui-bootstrap',
    'angular-route',
    'ui-utils',
    'ui-map',
//    'ngAutocomplete',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index'

    ], function (ng, ngRoute, bootstrap) {
        'use strict';

    console.log("MODULES==================++++=========================");
    console.log(ng, bootstrap, ngRoute );
    console.log("MODULES==================++++=========================");
    return ng.module('app', [
        'ngRoute',
//        'ngAutocomplete',
        'app.services',
        'app.filters',
        'app.directives',
        'app.controllers',
        'ui.bootstrap',
        'ui.utils',
        'ui.map'
        ]);
});