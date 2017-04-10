"use strict"
/*
 * Allow you to search spotify api.
 * This search can do artist, albums, and track
 * returns: the search results
 */

var googleAPIKey = GoogleMapsEmbedConfig.apiKey;
var seatgeekAPIKey = SeatGeekConfig.apiKey;
var bandName = sessionStorage.getItem('Hear+Now:bandName');
var closeEvents = [];
var eventsOrdered = [];
var chronologicalSort = true;
var distanceSort = false;
var bandArray = [];
var bandArrayIndex = 0;
var relatedAdded = false;
var originalSearch = false;
var distanceDone = false;
var zipcode = sessionStorage.getItem('Hear+Now:location');
var userLat = 0;
var userLon = 0;
var venueZip = 0;
var defaultRange = 200;
var userRange = 0;
var eventIndex = 0;
var perPage = 10;

spotifySearch(bandName);

function spotifySearch(searchQuery) {

    $.ajax({
        url: "https://api.spotify.com/v1/search?query=" + searchQuery + "&type=artist,track,album&offset=0&limit=20",
    }).done(function(data) {
        // cardCreate(data.artists.items[0].name, data.artists.items[0].images[1].url);
        console.log(data);
        // bandArray.push(data.artists.items[0]);
        var bandPic = false;
        //Try to find an image with 640px width
        for (var i = 0; i < data.artists.items[0].images.length; i++) {
            if (data.artists.items[0].images[i].width === 640) {
                var bandPic = data.artists.items[0].images[i].url;
            }
        }
        //If an image with 640 width can't be found use the 2nd image
        if (!bandPic) bandPic = data.artists.items[0].images[1].url;
        seatGeekSearch(data.artists.items[0].name, bandPic);

        // // console.log(data);
        getRelatedArtist(data.artists.items[0].id);
        return data;
    }).fail(function(e) {
        console.log("An error occurred trying with search query" + e);
    });
}

function spotifyIFrame(albumId) {

    var iSrc = "https://embed.spotify.com/?uri=spotify%3Aalbum%3A" + albumId + "&theme=white"
    var frame = $("<iframe>");

    $(frame).attr("src", iSrc);
    $(frame).css({ "width": "100%", "height": "80", "frameborder": "0", "allowtransparency": "true" })

    //$("#test").append(frame);
    return frame;
    //.albums.items["0"].id
}

function initMasonry() {
    // Add masonry effect
    var $container = $('#masonry-grid');
    // initialize
    $container.masonry({
        columnWidth: '.col',
        itemSelector: '.col',
    });
}

// function relatedDates() {
//     for (var i = 1; i < bandArray[0].artists.length; i++) {
//         console.log(bandArray[0].artists[i].name);
//         // seatGeekSearch(bandArray[0].artists[i].name,);
//     }
// }

function getRelatedArtist(artistId) {
    $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/related-artists",
    }).done(function(data) {
        // bandArray.push(data);
        for (var i = 0; i < data.artists.length; i++) {
            bandArray.push(data.artists[i]);
        }

        console.log(bandArray);
        for (var i = 0; i < bandArray.length; i++) {
            var bandPic = false;
            //Try to find an image with 640px width
            for (var j = 0; j < bandArray[i].images.length; j++) {
                if (bandArray[i].images[j].width === 640) {
                    var bandPic = bandArray[i].images[j].url;
                }
            }
            //If an image with 640 width can't be found use the 2nd image
            if (!bandPic) bandPic = bandArray[i].images[1].url;
            seatGeekSearch(bandArray[i].name, bandPic);
            // cardCreate(bandArray[0].artists[i].name, bandArray[0].artists[i].images[1].url);
            // initMasonry();
        }

        // relatedDates();
        // initMasonry();
        return data;
    }).fail(function(e) {
        // console.log("Getting related artist failed" + e);
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
function timeFormat() {
    for (var i = 0; i < closeEvents.length; i++) {
        if (closeEvents[i].events.length > 0) {
            for (var j = 0; j < closeEvents[i].events.length; j++) {
                var eventObj = closeEvents[i].events[j];
                var timeFormat = moment(closeEvents[i].events[j].datetime_local).format("h:mma ddd, MMM DD");
                eventObj.date_format = timeFormat;

            }
        }
    }
    // initMasonry();

}

function seatGeekSearch(band, img) {
    // var bandName = $(this).attr("data-band");
    eventIndex = 0;
    if (userRange === 0) {
        //Will have to change bandName to band when we can put a band name through the function
        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + band + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {
            closeEvents.push(response);

            // userLatLon(id);
            timeFormat();
            cardCreate(band, img);
            console.log(closeEvents);
            // initMasonry();
        });
    } else {
        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + band + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {

            closeEvents.push(response);
            // userLatLon(id);
            // initMasonry();
        });
    }
    // console.log(closeEvents);
}

function cardCreate(name, image) {
    var uniqueId = _.uniqueId();
    var arrayIndex = uniqueId - 1;
    var newCol = $("<div>");
    newCol.addClass("col s12 m6 l4 xl3");
    var newCard = $("<div>");
    newCard.addClass("card hoverable");
    var imgDiv = $("<div>");
    imgDiv.addClass("card-image");
    var bandImg = $("<img>");
    bandImg.attr("src", image);

    var cardButtons = $("<ul>");
    cardButtons.addClass("card-action-buttons");
    cardButtons.html("<li><a class='btn-floating favorite'><i class='material-icons'>favorite</i></a></li><li><a class='btn-floating amber darken-1 spotify activator'><i class='material-icons'>volume_up</i></a></li>");

    var cardContent = $("<div>");
    cardContent.addClass("card-content");
    cardContent.attr("id", uniqueId);

    var bandName = $("<span>");
    bandName.addClass("card-title");
    bandName.text(name);

    // console.log("frank");
    // console.log(closeEvents[arrayIndex]);
    // addDates(uniqueId - 1);

    // for (var i = 0; 0 < closeEvents[arrayIndex].events.length; i++) {
    //     var eventDates = $("<p>");

    //     eventDates.append(closeEvents[arrayIndex].events[i].date_format);
    //     eventDates.append(" @ ");
    //     eventDates.append(closeEvents[arrayIndex].events[i].venue.name);
    //     eventDates.append(" in ");
    //     eventDates.append(closeEvents[arrayIndex].events[i].venue.display_location);
    //     eventDates.append(" - ");

    //     var link = $("<a>");
    //     link.attr("href", closeEvents[arrayIndex].events[i].url);
    //     link.text("Tickets");
    //     eventDates.append(link);
    //     // closeEvents.splice(0, 1);
    //     // console.log(i);

    // }

    var cardReveal = $("<div>");
    cardReveal.addClass("card-reveal");
    var revealSpan = $("<span>");
    revealSpan.addClass("card-title grey-text text-darken-4");
    revealSpan.html("<i class='material-icons right text-white'>close</i>");

    // var cardIframe = $("<iframe>");
    // // cardIframe.attr("src", );
    // cardIframe.attr("width", 100%);
    // cardIframe.attr("height", 80);
    // cardIframe.attr("frameborder", 0);
    // cardIframe.attr("allowtransparency", true);

    cardReveal.append(revealSpan);
    imgDiv.append(bandImg);
    imgDiv.append(cardButtons);
    newCard.append(imgDiv);
    cardContent.append(bandName);
    newCard.append(cardContent);
    newCard.append(cardReveal);

    newCol.append(newCard);
    $("#masonry-grid").append(newCol);
    // initMasonry();

    addDates(uniqueId - 1, uniqueId);
}

function addDates(index, id) {
    for (var i = 0; i < closeEvents[index].events.length; i++) {
        if (closeEvents[index].events[i].type === "concert" || closeEvents[index].events[i].type === "broadway_tickets_national" || closeEvents[index].events[i].type === "comedy") {
            var eventName = $("<p>");
            eventName.addClass("event-title");
            eventName.append(closeEvents[index].events[i].short_title);
            eventName.append(": ");
            var eventDates = $("<p>");
            eventDates.append(closeEvents[index].events[i].date_format);
            eventDates.append(" @ ");
            eventDates.append(closeEvents[index].events[i].venue.name);
            eventDates.append(" in ");
            eventDates.append(closeEvents[index].events[i].venue.display_location);
            eventDates.append(" - ");

            var link = $("<a>");
            link.attr("href", closeEvents[index].events[i].url);
            link.attr("target", "_blank");
            link.text("Tickets");
            eventDates.append(link);
            $("#" + id).append(eventName);
            $("#" + id).append(eventDates);
            // bandName.append(eventDates);
            // eventsOrdered.splice(0, 1);
            // if (eventsOrdered.length === 0) {
            //     seatGeekSearch(bandArray[0].artists[bandArrayIndex].name, uniqueIdStarter);
            //     bandArrayIndex++;
            //     uniqueIdStarter++;
            // }

        }
        // initMasonry();
    }

}

// function userLatLon(id) {
//     var googleLatLonURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&key=" + googleAPIKey;

//     $.ajax({
//         url: googleLatLonURL,
//         method: "GET"
//     }).done(function(response) {

//         userLat = parseFloat(response.results[0].geometry.location.lat);
//         userLon = parseFloat(response.results[0].geometry.location.lng);
//         // console.log(response.results[0].geometry.location.lat);
//         // console.log(response.results[0].geometry.location.lng);

//         if (userLon !== false && userLat !== false) {
//             distance(id);
//             eventSort();
//             // console.log(eventsOrdered);
//         }

//     });


// }


// function distance(id) {

//     eventIndex = 0;

//     for (var i = 0; i < closeEvents[0].events.length; i++) {
//         //Variable to pick each particular event

//         var eventObj = closeEvents[0].events[i];
//         var eventLat = eventObj.venue.location.lat;
//         var eventLon = eventObj.venue.location.lon;
//         var eventLocation = eventObj.venue.display_location;



//         var origin = new google.maps.LatLng(userLat, userLon);
//         var destination = new google.maps.LatLng(eventLat, eventLon);

//         var service = new google.maps.DistanceMatrixService();
//         service.getDistanceMatrix({
//             origins: [origin],
//             destinations: [destination],
//             travelMode: 'DRIVING',
//             unitSystem: google.maps.UnitSystem.IMPERIAL,
//             avoidHighways: false,
//             avoidTolls: false,
//         }, callback);

//         function callback(response, status) {
//             if (status == 'OK') {
//                 console.log(closeEvents[0]);

//                 var eventObj = closeEvents[0].events[eventIndex];
//                 var timeFormat = moment(closeEvents[0].events[eventIndex].datetime_local).format("h:mma ddd, MMM DD");

//                 eventObj.date_format = timeFormat;

//                 eventObj.distance = response.rows[0].elements[0].distance.text;
//                 eventObj.distanceNum = parseFloat(response.rows[0].elements[0].distance.text);


//                 eventsOrdered.push(closeEvents[0].events[eventIndex]);


//                 // console.log(eventsOrdered);

//                 eventIndex++;
//                 if (eventIndex === closeEvents[0].events.length) {
//                     distanceDone = true;
//                 }

//                 // console.log(eventsOrdered);
//                 //
//                 //
//                 //  Part of Google Maps distance code
//                 //
//                 //
//                 var origins = response.originAddresses;
//                 var destinations = response.destinationAddresses;

//                 for (var i = 0; i < origins.length; i++) {
//                     var results = response.rows[i].elements;


//                     for (var j = 0; j < results.length; j++) {
//                         var element = results[j];
//                         var distance = element.distance.text;
//                         var duration = element.duration.text;
//                         var from = origins[i];
//                         var to = destinations[j];



//                     }
//                 }
//             }
//         }

//     }

// }

// function eventSort() {
//     if (typeof closeEvents[0].events[eventIndex].type === undefined) {
//         $("#" + id).text('No events found in your area');

//     } else if (closeEvents[0].events[eventIndex].type === "concert" || closeEvents[0].events[eventIndex].type === "broadway_tickets_national" || closeEvents[0].events[eventIndex].type === "comedy") {



//         // if (chronologicalSort) {
//         //     //Sorts the events in the events ordered array by a certain key value
//         //     eventsOrdered.sort(function(a, b) {

//         //         //returns the objects in order from lowest date to highest date
//         //         return a.datetime_local - b.datetime_local;
//         //     });
//         // } else if (distanceSort) {
//         //     eventsOrdered.sort(function(a, b) {

//         //         //returns the objects in order from lowest distance to highest distance
//         //         return a.distanceNum - b.distanceNum;
//         //     });
//         // }


//         console.log(eventsOrdered);
//         console.log(closeEvents[0].events.length);
//         for (var i = 0; i < eventsOrdered.length; i++) {
//             var eventName = $("<p>");
//             eventName.text(eventsOrdered[i].short_title + ":");
//             var eventDates = $("<p>");
//             eventDates.append(eventsOrdered[i].date_format);
//             eventDates.append(" @ ");
//             eventDates.append(eventsOrdered[i].venue.name);
//             eventDates.append(" in ");
//             eventDates.append(eventsOrdered[i].venue.display_location);
//             eventDates.append(" - ");

//             var link = $("<a>");
//             link.attr("href", eventsOrdered[i].url);
//             link.attr("target", "_blank");
//             link.text("Tickets");
//             eventDates.append(link);
//             eventName.append(eventDates);
//             $("#" + id).append(eventName);
//             // bandName.append(eventDates);
//             eventsOrdered.splice(0, 1);
//             // if (eventsOrdered.length === 0) {
//             //     seatGeekSearch(bandArray[0].artists[bandArrayIndex].name, uniqueIdStarter);
//             //     bandArrayIndex++;
//             //     uniqueIdStarter++;
//             // }


//         }

//     }
//     // function relatedDates() {

//     //     for (var i = 0; i < bandArray[0].artists.length; i++) {
//     //         cardCreate(bandArray[0].artists[i].name, bandArray[0].artists[i].images[1].url);
//     //         // seatGeekSearch(bandArray[0].artists[i].name, uniqueId);

//     //     }

//     // }

// }



// function bandArray(image, name) {

//     for (var i = 0; i < data.artists.length; i++) {
//         var newCol = $("<div>");
//         newCol.addClass("col s12 m6 l4 xl3");

//         var newCard = $("<div>");
//         newCard.addClass("card hoverable");

//         var imgDiv = $("<div>");
//         imgDiv.addClass("card-image");

//         var bandImg = $("<img>");
//         bandImg.attr("src", image);

//         var cardButtons = $("<ul>");
//         cardButtons.addClass("card-action-buttons");
//         cardButtons.html("<li><a class='btn-floating pink favorite'><i class='material-icons'>favorite</i></a></li><li><a class='btn-floating amber darken-1 spotify activator'><i class='material-icons'>volume_up</i></a></li>");

//         var cardContent = $("<div>");
//         cardContent.addClass("card-content");
//         var bandName = $("<span>");
//         bandName.addClass("card-title");
//         bandName.text(response.artists[i].name);

//         var eventDates = $("<p>");

//         for (var i = 0; 0 < closeEvents.length; i++) {
//             eventDates.append(closeEvents[0].date_format);
//             eventDates.append(" @ ");
//             eventDates.append(closeEvents[0].venue.name);
//             eventDates.append(" in ");
//             eventDates.append(closeEvents[0].venue.display_location);
//             eventDates.append(" - ");

//             var link = $("<a>");
//             link.attr("href", closeEvents[0].url);
//             link.text("Tickets");
//             eventDates.append(link);
//             bandName.append(eventDates);
//             closeEvents.splice(0, 1);

//         }

//         var cardReveal = $("<div>");
//         cardReveal.addClass("card-reveal");
//         var revealSpan = $("<span>");
//         revealSpan.addClass("card-title grey-text text-darken-4");
//         revealSpan.html("<i class='material-icons right text-white'>close</i>");

//         var cardIframe = $("<iframe>");
//         cardIframe.attr("src", );
//         cardIframe.attr("width", 100 % );
//         cardIframe.attr("height", 80);
//         cardIframe.attr("frameborder", 0);
//         cardIframe.attr("allowtransparency", true);

//         cardReveal.append(revealSpan).append(cardIframe);
//         newCard.append(bandImg).append(cardButtons);
//         cardContent.append(bandName);

//         newCol.append(newCard).append(cardContent).append(cardReveal);
//         $("#cardPopulation").append(newCol);

//     }
// }

// seatGeekSearch();

// bandImg.attr("src", response.artists.items[0].images[1].url);

// bandName.text(response.artists.items[0].name);

setTimeout(function() { initMasonry() }, 2500);
