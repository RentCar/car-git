require.config({
    // alias libraries paths
    paths: {
        'domReady': 'libs/requirejs-domready/domReady',
        'angular': 'libs/angular/angular',
        'angular-route': 'libs/angular-route/angular-route',
        'ui-utils': 'libs/angular-ui-utils/ui-utils',
        'ui-map': 'libs/angular-ui-map/ui-map',
        'ui-router': 'libs/angular-ui-router/release/angular-ui-router',
        'ui-bootstrap': '/js/local-libs/angular-ui-bootstrap',
        'socket.io': '/socket.io/socket.io.js'
    },
    // angular does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-route' : {
            deps: ['angular']
        },
        'ui-bootstrap' : {
            deps: ['angular']
        },
        'ui-utils' : {
            deps: ['angular']
        },
        'ui-map' : {
            deps: ['angular']
        },
        'ui-router': {
            deps: ['angular']
        }
    },
    // kick start application
    deps: ['./angular-init']
});