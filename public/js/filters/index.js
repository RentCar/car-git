/**
 * Created by Artem on 17.11.13.
 */

//define([
//
//], function () {
//    console.log("Defined all filters")
//});

define(['angular'], function (ng) {
    'use strict';
    console.log("Returning module 'app.filters", ng);
    return ng.module('app.filters', []);
});