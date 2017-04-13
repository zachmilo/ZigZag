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

spotifySearch(bandName, function(data) {
    var bandPic = false;
    //Try to find an image with 640px width
    for (var i = 0; i < data.artists.items[0].images.length; i++) {
        if (data.artists.items[0].images[i].width === 640) {
            var bandPic = data.artists.items[0].images[i].url;
        }
    }
    //If an image with 640 width can't be found use the 2nd image
    if (!bandPic) bandPic = data.artists.items[0].images[1].url;
    seatGeekSearch(data.artists.items[0].name, bandPic, data.artists.items[0].id);

    getRelatedArtist(data.artists.items[0].id, function(data) {
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
            seatGeekSearch(bandArray[i].name, bandPic, bandArray[i].id);
        }
    });

});

function spotifySearch(searchQuery, callbackFunc) {

    var buildQuery = _.replace(_.trim(searchQuery), " ", "+");

    $.ajax({
        url: "https://api.spotify.com/v1/search?query=" + buildQuery + "&type=artist&offset=0&limit=20",
    }).done(function(data) {
        return callbackFunc(data);
    }).fail(function(e) {
        console.log("An error occured trying with search query" + e);
    });
}

function spotifyIFrame(artistId, callbackFunc) {

    var albumId = "";

    $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/albums",
    }).done(function(data) {
        var albumId = Math.floor((Math.random() * data.items.length));
        var iSrc = "https://embed.spotify.com/?uri=spotify%3Aalbum%3A" + data.items[albumId].id + "&theme=white"
        var frame = $("<iframe>")
            .attr({
                src: iSrc,
                frameborder: 0,
                allowtransparency: true
            })
            .css({ "width": "100%", "height": "80" });

        return callbackFunc(frame);

    }).fail(function(e) {
        console.log("An error occured trying to get album" + e);
    });
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

function getRelatedArtist(artistId, callbackFunc) {

    $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/related-artists",
    }).done(function(data) {
        return callbackFunc(data);
    }).fail(function(e) {
        console.log("Getting related artist failed" + e);
    });
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

function seatGeekSearch(band, img, bandId) {
    eventIndex = 0;
    if (userRange === 0) {
        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + band + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {
            closeEvents.push(response);
            timeFormat();
            cardCreate(band, img, bandId);
        }).fail(function(e) {
            console.log("An error occured trying SeatGeek with search query" + e);
            //Since no dates can be added but the band is still present in the array increment the run but don't create a card
            runs++;
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

function cardCreate(name, image, bandId) {
    var uniqueId = _.uniqueId();
    var arrayIndex = uniqueId - 1;

    var newCol = $("<div>").addClass("col s12 m6 l4 xl3");
    var newCard = $("<div>").addClass("card hoverable");
    var imgDiv = $("<div>").addClass("card-image");
    var bandImg = $("<img>").attr("src", image);

    var cardButtons = $("<ul>")
        .addClass("card-action-buttons")
        .append($("<li>")
            .append($("<a>")
                .addClass("btn-floating favorite")
                .append($("<i>")
                    .addClass("material-icons")
                    .text("favorite")
                )
            ),
            $("<li>")
            .append($("<a>")
                .addClass("btn-floating amber darken-1 spotify activator")
                .append($("<i>")
                    .addClass("material-icons")
                    .text("volume_up")
                )
            )
        );

    var cardContent = $("<div>")
        .addClass("card-content")
        .attr("id", uniqueId);

    var bandName = $("<span>")
        .addClass("card-title")
        .text(name);

    var cardReveal = $("<div>").addClass("card-reveal");
    var revealSpan = $("<span>")
        .addClass("card-title grey-text text-darken-4")
        .append($("<i>")
            .addClass("material-icons right text-white")
            .text("close")
        );

    imgDiv.append(bandImg, cardButtons);
    cardContent.append(bandName);
    cardReveal.append(revealSpan);
    newCard.append(imgDiv, cardContent, cardReveal);

    newCol.append(newCard);
    $("#masonry-grid").append(newCol);

    addDates(uniqueId - 1, uniqueId);
}

function addDates(index, id) {
    for (var i = 0; i < closeEvents[index].events.length; i++) {
        if (closeEvents[index].events[i].type === "concert" || closeEvents[index].events[i].type === "broadway_tickets_national" || closeEvents[index].events[i].type === "comedy") {
            var eventName = $("<p>")
                .addClass("event-title")
                .append(closeEvents[index].events[i].short_title)
                .append(": ");
            var eventDates = $("<p>")
                .append(closeEvents[index].events[i].date_format)
                .append(" @ ")
                .append(closeEvents[index].events[i].venue.name)
                .append(" in ")
                .append(closeEvents[index].events[i].venue.display_location)
                .append(" - ");
            var link = $("<a>")
                .attr({
                    href: closeEvents[index].events[i].url,
                    target: "_blank"
                })
                .text("Tickets");
            eventDates.append(link);
            $("#" + id).append(eventName, eventDates);
        }
    }
    //keep track of the number of runs so masonry can be enabled at the end
    runs++;
    checkLoaded(runs);
}

function checkLoaded(passes) {
    //count the number of times addDates() was run and see if its equal to the number of bands.  If it is run masonry
    if (passes === bandArray.length + 1) {
        initMasonry();
    }
}
