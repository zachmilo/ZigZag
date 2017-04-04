
var zipcodeAPIKey = ZipCodeConfig.apiKey;
var seatgeekAPIKey = SeatGeekConfig.apiKey;
var googleAPIKey = GoogleMapsEmbedConfig.apiKey;
var zipcode = 27502;
var userLat = false;
var userLon = false;
var eventIndex = 0; 
var bandName = "carbon leaf";
var closeEvents = [];
var eventsOrdered = [];
var relatedBands = [];
var venueZip = 0;
var range = 30;
var defaultRange = 200;
var userRange = 0;


function seatGeekSearch() {


    if (userRange === 0) {


        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandName + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {

            closeEvents.push(response);
            userLatLon();



        });




    }
     else {
         var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandName + "&geoip=" + zipcode + "&range=" + userRange + "mi&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {

            closeEvents.push(response);
            userLatLon();



        });

     }
    console.log(closeEvents);

}

function userLatLon() {
    var googleLatLonURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&key=" + googleAPIKey;

     $.ajax({
            url: googleLatLonURL,
            method: "GET"
        }).done(function(response) {

            userLat = parseFloat(response.results[0].geometry.location.lat);
            userLon = parseFloat(response.results[0].geometry.location.lng);

            if (userLon !== false && userLat !== false) {
            distance();
            console.log(eventsOrdered);
        }

        });

  
}

function distance() {

    eventIndex = 0;

    for (var i = 0; i < closeEvents[0].events.length; i++) {
        //Variable to pick each particular event

        var eventObj = closeEvents[0].events[i];
        var eventLat = eventObj.venue.location.lat;
        var eventLon = eventObj.venue.location.lon;
        var eventLocation = eventObj.venue.display_location;


        var origin = new google.maps.LatLng(userLat, userLon);
        var destination = new google.maps.LatLng(eventLat, eventLon);

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false,
        }, callback);

        function callback(response, status) {
            if (status == 'OK') {

                if (closeEvents[0].events[eventIndex].type === "concert") {
                    //This is where I need to modify the the time to be something I can use
                    
                    var timeFormat = moment(closeEvents[0].events[eventIndex].datetime_local).format("h:mma ddd, MMM DD");


                    var eventObj = closeEvents[0].events[eventIndex];
                    eventObj.date_format = timeFormat; 

                    eventObj.distance = response.rows[0].elements[0].distance.text;
                    eventObj.distanceNum = parseFloat(response.rows[0].elements[0].distance.text);
                    eventsOrdered.push(closeEvents[0].events[eventIndex]);

                    eventIndex++;


                    //Sorts the events in the events ordered array by a certain key value
                    eventsOrdered.sort(function(a, b) {


                        //returns the objects in order from lowest date to highest date
                        return a.datetime_local - b.datetime_local;
                    });

                    console.log(eventsOrdered);

                    var origins = response.originAddresses;
                    var destinations = response.destinationAddresses;

                    for (var i = 0; i < origins.length; i++) {
                        var results = response.rows[i].elements;


                        for (var j = 0; j < results.length; j++) {
                            var element = results[j];
                            var distance = element.distance.text;
                            var duration = element.duration.text;
                            var from = origins[i];
                            var to = destinations[j];
                            var eventObj = closeEvents[0].events[i];
                            eventObj.distance = response.rows[j].elements[0].distance.text;
                            

                        }
                    }
                }
            }
                
            }

        }





    };


    seatGeekSearch();

