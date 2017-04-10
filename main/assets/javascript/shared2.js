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

// Main Function
getArist(bandName);

function getArist(searchQuery) {
    $.ajax({
        url: "https://api.spotify.com/v1/search?query=" + searchQuery + "&type=artist,track,album&offset=0&limit=20",
    }).done(function(data) {
        getRelatedArtists(data);
    }).fail(function(e) {
        console.log("An error occurred trying with search query" + e);
    });
}

function getRelatedArtists(artist) {
    $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artist.artists.items[0].id + "/related-artists",
    }).done(function(data) {
        bandArray.push(artist);
        for (var i = 0; i < data.artists.length; i++) {
            bandArray.push(data.artists[i]);
        }
        cardCreate(bandArray);
    }).fail(function(e) {});
}

function cardCreate(aristsObject) {
    for (var i = 0; i < aristsObject.length; i++) {
        var bandPic = false;
        //Try to find an image with 640px width
        for (var j = 0; j < artistsObject[i].artists.items[0].images.length; j++) {
            if (artistsObject[i].artists.items[0].images[j].width === 640) {
                var bandPic = artistsObject[i].artists.items[0].images[j].url;
            }
        }
        //If an image with 640 width can't be found use the 2nd image
        if (!bandPic) bandPic = artistsObject.artists.items[0].images[1].url;

        let uniqueId = _.uniqueId();
        // let arrayIndex = uniqueId - 1;
        let newCol = $("<div>");
        newCol.addClass("col s12 m6 l4 xl3");
        let newCard = $("<div>");
        newCard.addClass("card hoverable");
        let imgDiv = $("<div>");
        imgDiv.addClass("card-image");
        let bandImg = $("<img>");
        bandImg.attr("src", bandPic);

        let cardButtons = $("<ul>");
        cardButtons.addClass("card-action-buttons");
        cardButtons.html("<li><a class='btn-floating favorite'><i class='material-icons'>favorite</i></a></li><li><a class='btn-floating amber darken-1 spotify activator'><i class='material-icons'>volume_up</i></a></li>");

        let cardContent = $("<div>");
        cardContent.addClass("card-content");
        cardContent.attr("id", uniqueId);

        let bandName = $("<span>");
        bandName.addClass("card-title");
        bandName.text(aristsObject[i].artists.items[0].name);

        let cardReveal = $("<div>");
        cardReveal.addClass("card-reveal");
        let revealSpan = $("<span>");
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
}

function spotifyIFrame(albumId) {
    var iSrc = "https://embed.spotify.com/?uri=spotify%3Aalbum%3A" + albumId + "&theme=white"
    var frame = $("<iframe>");

    frame.attr("src", iSrc);
    frame.css({ "width": "100%", "height": "80", "frameborder": "0", "allowtransparency": "true" })

    //$("#test").append(frame);
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



/*
<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%3A33Q6ldVXuJyQmqs8BmAa0k&theme=white" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>
 */


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
            console.log(closeEvents);
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
}

setTimeout(function() { initMasonry() }, 2500);
