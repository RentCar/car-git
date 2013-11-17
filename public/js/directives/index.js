/**
 * Created by Artem on 17.11.13.
 */

//define([
//
//], function () {
//    console.log("Defined all directives")
//});

define(['angular'], function (ng) {
    'use strict';
    console.log("Returning module 'app.directives", ng);
    return ng.module('app.directives', []);
});