define(['googleMaps'], function(gm) {
//
//    console.log("INITING GOOGLE MAPS")
//    console.log(gm)
//    function initialize() {

        var input = document.getElementById('searchTextField');

        /* restrict to multiple cities? */
        var options = {
            types: ['(cities)'],
            componentRestrictions: {country: "ua"}
        };


    console.log(input, google.maps, autocomplete);
    var autocomplete = new google.maps.places.Autocomplete(input, options);
//    }
//
//    google.maps.event.addDomListener(window, 'load', initialize);
});
