"use strict"
/*
* Allow you to search spotify api.
* This search can do artist, albums, and track
* returns: the search results
 */


function spotifySearch(searchQuery) {

    var buildQuery = _.replace(_.trim(searchQuery), " ","+");

    $.ajax({
        url: "https://api.spotify.com/v1/search?query="+buildQuery+"&type=artist,track,album&offset=0&limit=20",
    }).done(function(data) {
        console.log(data);
        return data;
    }).fail(function(e) {
        console.log( "An error occured trying with search query"+ e );
    });
}

function spotifyIFrame(albumId) {

    var iSrc = "https://embed.spotify.com/?uri=spotify%3Aalbum%3A"+albumId+"&theme=white"
    var frame = $("<iframe>");

    $(frame).attr("src",iSrc);
    $(frame).css({"width":"100%", "height":"80", "frameborder":"0", "allowtransparency":"true"})

    //$("#test").append(frame);
    return frame;
    //.albums.items["0"].id
}

function getRelatedArtist(artistId) {
    $.ajax({
        url: "https://api.spotify.com/v1/artists/"+artistId+"/related-artists",
    }).done(function(data) {
        console.log(data);
        return data;
    }).fail(function(e) {
        console.log( "Getting related artist failed"+ e );
    });

}
/*
<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%3A33Q6ldVXuJyQmqs8BmAa0k&theme=white" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>
 */
/*

#band picture
.artists.items["0"].images[1].url

#band name
.artists.items["0"].name
 */

//GET https://api.spotify.com/v1/artists/{id}/related-artists


//
//
// THIS IS THE CODE SCOTT WROTE FOR THE SEAT GEEK EVENT LISTINGS AND DISTANCE FUNCTIONS
//
// //"use strict"

var zipcodeAPIKey = ZipCodeConfig.apiKey;
var seatgeekAPIKey = SeatGeekConfig.apiKey;
var bandName = "chicago";
var closeEvents = [];
var eventsOrdered = [];
var relatedBands = [];
var zipcode = "27502";
var userLat = 0;
var userLon = 0;
var venueZip = 0;
var defaultRange = 200;
var userRange = 0;
var eventIndex = 0;
var perPage = 10;


function seatGeekSearch() {
    // var bandName = $(this).attr("data-band");


    if (userRange === 0) {


        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandName + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {

            closeEvents.push(response);
            userLatLon();



        });




    } else {
        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandName + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

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
    var googleLatLonURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&key=" + GoogleMapsEmbedConfig.apiKey;

    $.ajax({
        url: googleLatLonURL,
        method: "GET"
    }).done(function(response) {

        // console.log("below is lat lon");
        // console.log(response.results[0].geometry.location);
        userLat = parseFloat(response.results[0].geometry.location.lat);
        userLon = parseFloat(response.results[0].geometry.location.lng);
        // console.log(userLon);
        console.log(response.results[0].geometry.location.lat);
        console.log(response.results[0].geometry.location.lng);

        if (userLon !== false && userLat !== false) {
            // console.log(userLon);
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

        // var googleMapsURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + zipcode + "&destinations=" + venueAddress + "&key=AIzaSyCqmi8XbEgdxQWsUS9H5t27rAnmotbqFhA";


        var origin = new google.maps.LatLng(userLat, userLon);
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

                if (closeEvents[0].events[eventIndex].type === "concert" || closeEvents[0].events[eventIndex].type === "broadway_tickets_national" || closeEvents[0].events[eventIndex].type === "comedy") {

                    var eventObj = closeEvents[0].events[eventIndex];
                    var timeFormat = moment(closeEvents[0].events[eventIndex].datetime_local).format("h:mma ddd, MMM DD");

                    eventObj.date_format = timeFormat;

                    eventObj.distance = response.rows[0].elements[0].distance.text;
                    eventObj.distanceNum = parseFloat(response.rows[0].elements[0].distance.text);

                    if (eventObj.distanceNum <= defaultRange) {
                        eventsOrdered.push(closeEvents[0].events[eventIndex]);
                    }

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
                            


                        }
                    }
                }
            }
            
        }

    }

};


seatGeekSearch();
