/**
 * Factory for socket.io lib
 * commented us example
 */
// loads to init file (require)
define(['./init', 'socket.io'], function (services, io) {
    'use strict';
    services.factory('socket', [function () {
        //connection to default
        var socket = io.connect(location.origin);
        // return sockets object
        return socket
    }]);
});