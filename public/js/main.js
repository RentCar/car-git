require.config({
    // alias libraries paths
    paths: {
        'domReady': 'libs/requirejs-domready/domReady',
        'angular': 'libs/angular/angular',
        'angular-route': 'libs/angular-route/angular-route',
        'socket.io': '/socket.io/socket.io.js'
//        'googleMaps': 'https://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&key=AIzaSyB1TGYNrikCmxtjmCmkYtG5biJSpuYmHaU'
//        'ng-Autocomplete': 'modules/ngAutocomplete'
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
//        'googleMaps': {
//            exports: 'googleMaps'
//        }/*,
//        'ngAutocomplete' : {
//            deps: ['angular', 'googleMaps']
//        }*/
//        'autocomplete': {}
    },
    // kick start application
    deps: ['./angular-init']
});