/**
 * Created by Artem on 16.11.13.
 * bootstraps angular onto the window.document node
 */
define([
    'require',
    'angular',
//    'angular-route',
    'app',
    'routes'
], function (require, ng) {
     'use strict';
     require(['domReady!'], function (document) {
         ng.bootstrap(document, ['app']);
     });
 });