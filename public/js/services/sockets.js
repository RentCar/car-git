define(['./module', 'socket.io'], function (services, io) {
    'use strict';

    console.log("Init Socket factory")
    services.factory('sockets', [function () {
        console.log("socket factory: ", io)
        return {
            a:1,
            b:2
        }
    }]);
});