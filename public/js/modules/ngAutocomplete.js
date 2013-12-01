'use strict';

/**
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Usage:
 *
 * <input type="text" ng-autocomplete="result" details="details" options="options"/>
 *
 *   + `ng-autocomplete="result"`: specifies the directive, $scope.result will hold the textbox autocomplete result
 *
 *   + `details="details"`: $scope.details will hold the autocomplete's more detailed result; latlng. address components, etc.
 *
 *   + `options="options"`: options provided by the user that filter the autocomplete results
 *
 *      - options = {
 *           types: type,        string, values can be 'geocode', 'establishment', '(regions)', or '(cities)'
 *           bounds: bounds,     google maps LatLngBounds Object
 *           country: country    string, ISO 3166-1 Alpha-2 compatible country code. examples; 'ca', 'us', 'gb'
 *         }
 *
 *
 */

angular.module( "ngAutocomplete", [])
