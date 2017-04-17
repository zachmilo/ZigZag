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

function loadResults() {
    spotifySearch(bandName, function(data) {
        //Get the band picture
        var bandPic = getBandPicture(data.artists.items[0].images);
        //Search for shows and create the card
        seatGeekSearch(data.artists.items[0].name, bandPic, data.artists.items[0].id);
        //Get the related arists
        getRelatedArtist(data.artists.items[0].id, function(data) {
            //Put the related artists into bandArray
            for (var i = 0; i < data.artists.length; i++) {
                bandArray.push(data.artists[i]);
            }
            //Get the related arists band pictures, shows, and create their cards
            for (var i = 0; i < bandArray.length; i++) {
                var bandPic = getBandPicture(bandArray[i].images);
                seatGeekSearch(bandArray[i].name, bandPic, bandArray[i].id);
            }
        });
    });
}

function spotifySearch(searchQuery, onSuccess, onFailure) {

    var buildQuery = _.replace(_.trim(searchQuery), " ", "+");

    $.ajax({
        url: "https://api.spotify.com/v1/search?query=" + buildQuery + "&type=artist&offset=0&limit=20",
    }).done(function(data) {
        return onSuccess(data);
    }).fail(function(e) {
        console.log("An error occured trying with search query" + e);
        return onFailure(e);
    });
}

function spotifyIFrame(artistId, onSuccess, onFailure) {

    $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?country=US",
    }).done(function(data) {

        var trackId = Math.floor(Math.random() * data.tracks.length);
        var iSrc = "https://embed.spotify.com/?uri=spotify:track:" +
            data.tracks[trackId].id + "&theme=white"
        var frame = $("<iframe>")
            .attr({
                src: iSrc,
                frameborder: 0,
                allowtransparency: true
            })
            .css({ "width": "100%", "height": "80" });

        return onSuccess(frame);

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

function getRelatedArtist(artistId, onSuccess, onFailure) {

    $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/related-artists",
    }).done(function(data) {
        return onSuccess(data);
    }).fail(function(e) {
        console.log("Getting related artist failed" + e);
    });
}

function getBandPicture(images) {
    var bandPic = false;
    //Try to find an image with 640px width
    if (images.length > 0) {
        for (var i = 0; i < images.length; i++) {
            if (images[i].width === 640) {
                var bandPic = images[i].url;
            }
        }
        //If an image with 640 width can't be found use the 2nd image
        if (!bandPic) bandPic = images[1].url;
    } else {
        //If the artist has no images on spotify then it'll use the no-pic default
        bandPic = "main/assets/media/images/no-pic.png";
    }
    return bandPic;
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

function seatGeekSearch(band, img, bandId, onSuccess, onFailure) {
    eventIndex = 0;
    if (userRange === 0) {
        var bandWithoutAnd = band.replace(" & ", " ");
        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandWithoutAnd + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

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
        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandWithoutAnd + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {
            closeEvents.push(response);
        });
    }
}

function cardCreate(name, image, bandId, callback) {
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
                .attr("id", bandId)
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

function addDates(index, id, callback) {
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
    //keep track of the number of times addDates() has been run so masonry can be enabled after the last time
    runs++;
    checkCompletion();
}

function checkCompletion() {
    if (runs === bandArray.length + 1) {
        setTimeout(function() {
            initMasonry();
        }, 100);
    }
}

function setSessionStorage(bandName, location) {
    sessionStorage.setItem('Hear+Now:bandName', bandName);
    sessionStorage.setItem('Hear+Now:location', location);
}

function loadNewResults(id, images) {
    setSessionStorage($('#band_name').val().trim(), $('#location').val().trim());
    window.open("results.html", "_self");
}

//Validate the band name with Spotify and the zipcode with regex
function validateSearch(bandName, location) {
    var reg = /^\d+$/;

    if (reg.test(location) && location.length === 5) {
        location = true;
    } else {
        $('#location').val('');
        $('#location').attr('placeholder', 'PLEASE ENTER A VALID ZIP CODE');
        location = false;
    }

    $.ajax({
        url: "https://api.spotify.com/v1/search?query=" + bandName + "&type=artist,track,album&offset=0&limit=20",
    }).done(function(data) {
        if (data.artists.total != 0 && location) {
            loadNewResults(data.artists.items[0].id, data.artists.items[0].images);
        } else if (data.artists.total === 0) {
            $('#band_name').val('');
            $('#band_name').attr('placeholder', 'PLEASE ENTER A VALID BAND NAME');
        }
    }).fail(function(e) {
        console.log("An error occurred trying with search query" + e);
    });
}
