require.config({
    // alias libraries paths
    paths: {
        'domReady': 'libs/requirejs-domready/domReady',
        'angular': 'libs/angular/angular',
        'angular-route': 'libs/angular-route/angular-route',
        'socket.io': '/socket.io/socket.io.js'
       // 'jquery': 'libs/jquery/jquery'
    },
    // angular does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-route' : {
            deps: ['angular']
        }
    },
    // kick start application
    deps: ['./angular-init']
});