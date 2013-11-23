define(['angular', 'angular-route'], function (ng, ngRoute) {
    'use strict';
    console.log("+++++++++++++====>>>>" + "Defined Angular additional modules ", ng, ngRoute);
    return ng.module('ngRoute', ['ng']);
});