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
var runs = 0;

spotifySearch(bandName);

function spotifySearch(searchQuery) {

    $.ajax({
        url: "https://api.spotify.com/v1/search?query=" + searchQuery + "&type=artist,track,album&offset=0&limit=20",
    }).done(function(data) {
        // cardCreate(data.artists.items[0].name, data.artists.items[0].images[1].url);
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

    return frame;
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

function getRelatedArtist(artistId) {
    $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/related-artists",
    }).done(function(data) {
        // bandArray.push(data);
        for (var i = 0; i < data.artists.length; i++) {
            bandArray.push(data.artists[i]);
        }

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
        }
        return data;
    }).fail(function(e) {});

}

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
}

function seatGeekSearch(band, img) {
    eventIndex = 0;
    if (userRange === 0) {
        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + band + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {
            closeEvents.push(response);

            timeFormat();
            cardCreate(band, img);
        });
    } else {
        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + band + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {
            closeEvents.push(response);
        });
    }
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

    var cardReveal = $("<div>");
    cardReveal.addClass("card-reveal");
    var revealSpan = $("<span>");
    revealSpan.addClass("card-title grey-text text-darken-4");
    revealSpan.html("<i class='material-icons right text-white'>close</i>");

    cardReveal.append(revealSpan);
    imgDiv.append(bandImg);
    imgDiv.append(cardButtons);
    newCard.append(imgDiv);
    cardContent.append(bandName);
    newCard.append(cardContent);
    newCard.append(cardReveal);

    newCol.append(newCard);
    $("#masonry-grid").append(newCol);

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
        }
    }
    runs++;
    checkLoaded(runs);
}

function checkLoaded(passes) {
    if (passes === bandArray.length) {
        initMasonry();
    }
}
