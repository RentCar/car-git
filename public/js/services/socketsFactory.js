/**
 * Factory for socket.io lib
 * commented us example
 */

// loads to init file (require)
define(['./init', 'socket.io'], function (services, io) {
    'use strict';
    console.log("Init Socket factory")
    // added 'socket' factory to services array
    // init factory (angular)
    services.factory('socket', [function () {

        console.log("socket factory: ", io)

        //connection to default
        var socket = io.connect(location.origin);

        // test query
        socket.on('newUser', function (data) {
            console.log(data);
            socket.emit('data', { my: 'data' });
        });

        // return sockets object
        return socket
    }]);
});