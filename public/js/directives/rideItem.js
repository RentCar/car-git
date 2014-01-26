define(['./module'], function (directives) {
    'use strict';

    console.log("Init Ride tpl")
    directives.directive('rideItem', function () {
        return {
            restrict: 'E',
            transclude: true,
//            scope: {},
            // TODO: into template
            template: '<div class="ride-item">' +
                '<hr>' +
                '<h3>{{trip.startPrice}}$ to {{trip.route.points[1].addresses[0]}} trip </h3>' +
                // '<h4>Date: {{trip.date}}</h4>' +
                '<img src="{{trip.users[0].photo}}">' +
                '<ul style="float: right">' +
                '<li>From address: {{trip.route.points[0].addresses[0]}}</li>' +
                '<li>To address: {{trip.route.points[1].addresses[0]}}</li>' +
                '<li>Price: {{trip.startPrice}}</li>' +
                '<li>Driver: {{trip.users[0].first_name}} {{trip.users[0].last_name}}</li>' +
                '<li>email: {{trip.users[0].email}}</li>' +
                '</ul>' +
                '<button>Accept</button>' +
                '<button>Save</button>' +
                '<button>Connect</button>' +
                '<button>User details</button>' +
                '<button>Show trip</button>' +
                '<button>more</button>' +
                '<button>Never show from this user</button>' +
                '</div>'
        };
    })
});