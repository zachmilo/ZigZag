"use strict"

var zipcodeAPIKey = ZipCodeConfig.apiKey;
var seatgeekAPIKey = SeatGeekConfig.apiKey;
var bandName = "generations";
var closeEvents = [];
var eventsOrdered = [];
var relatedBands = [];
var zipcode = 27502;
var venueZip = 0;
var range = 30;
var defaultRange = 200;
var userRange = 0;
var eventIndex = 0;


function seatGeekSearch() {
    // var bandName = $(this).attr("data-band");


    if (userRange === 0) {


        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandName + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {

            closeEvents.push(response);
            distance();



        });




    }
    //  else {
    //     for (var i = 0; i < userRange; i += 5) {

    //         var zipcodeURL = "https://www.zipcodeapi.com/rest/" + zipcodeAPIKey + "/distance.json/" + zipcode + "/" + venueZip + "/mile";
    //         var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandName + "geoip=" + zipcode + "&range=" + range + "&client_id=" + seatgeekAPIKey;

    //         $.ajax({
    //             url: seatgeekURL,
    //             method: "GET"
    //         }).done(function(response) {

    //             console.log(response);

    //             for (var j = 0; j < response.events.length; j++) {
    //                 if (response.events[j].type === "concert") {


    //                 }

    //             }

    //         });

    //     }
    // }
    console.log(closeEvents);

}

function distance() {

    eventIndex = 0;

    for (var i = 0; i < closeEvents[0].events.length; i++) {
        //Variable to pick each particular event

        var eventObj = closeEvents[0].events[i];
        var eventLat = eventObj.venue.location.lat;
        var eventLon = eventObj.venue.location.lon;
        var eventLocation = eventObj.venue.display_location;

        // var googleMapsURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + zipcode + "&destinations=" + venueAddress + "&key=AIzaSyCqmi8XbEgdxQWsUS9H5t27rAnmotbqFhA";


        var origin = new google.maps.LatLng(35.7327, -78.8503);
        // var origin2 = "Apex, NC";
        // var destinationA = eventLocation;
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
                // console.log(response);

                if (closeEvents[0].events[eventIndex].type === "concert") {
                    var eventObj = closeEvents[0].events[eventIndex];
                    eventObj.distance = response.rows[0].elements[0].distance.text;
                    eventObj.distanceNum = parseFloat(response.rows[0].elements[0].distance.text);
                    eventsOrdered.push(closeEvents[0].events[eventIndex]);
                    console.log(eventsOrdered);

                    console.log(closeEvents[0].events[eventIndex].distance);
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
                            // console.log(response);
                            // var eventObj = closeEvents[0].events[i];
                            // eventObj.distance = response.rows[j].elements[0].distance.text;
                            // console.log("in results.length");
                            // console.log(results);
                            // console.log(destinations[j]);


                        }
                    }
                }}
                // eventObj.distance = response.rows[0].elements[0].distance.text;
                // console.log(response.rows[0].elements[0].distance.text);
                // console.log(closeEvents[0]);
            }

        }


        // console.log(closeEvents);



    };


    seatGeekSearch();
