/**
 * Created by Artem on 16.11.13.
 */
define(['angular', 'ngAutocomplete'], function (ng, ngAutocomplete) {
    'use strict';
    console.log("Defined Angular \nReturning module 'app.controllers", ng, ngAutocomplete);
     return ng.module('app.controllers', ['ngAutocomplete']);
});