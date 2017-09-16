"use strict"
/*
 * Allow you to search spotify api.
 * This search can do artist, albums, and track
 * returns: the search results
 */

var seatgeekAPIKey = "ODczNzQ4N3wxNTA0MjE2NDY3LjA4";
var bandName = sessionStorage.getItem('Hear+Now:bandName');
var closeEvents = {};
var bandArray = [];
var zipcode = sessionStorage.getItem('Hear+Now:location');

var defaultRange = 200;
var userRange = 0;
var eventIndex = 0;
var perPage = 10;
var runs = 0;

hasKey();
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
            //keep track of the number of times addDates() has been run so masonry can be enabled after the last time
            runs++;
            if (runs === bandArray.length + 1) {
                setTimeout(function() {
                    initMasonry();
                }, 100);
            }
        }

    });
});

function spotifySearch(searchQuery, callbackFunc) {

    var buildQuery = _.replace(_.trim(searchQuery), " ", "+");
    $.ajax({
        url: "https://api.spotify.com/v1/search?query=" + buildQuery + "&type=artist&offset=0&limit=20",
        headers: { "Authorization":"Bearer "+ sessionStorage.spotifyKey }
    }).done(function(data) {
        return callbackFunc(data);
    }).fail(function(e) {
        updateKey(e.status,this) //Passing this to retry after token update
    });
}

function spotifyIFrame(artistId, callbackFunc) {

    $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?country=US",
        headers: { "Authorization":"Bearer "+ sessionStorage.spotifyKey }
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

        return callbackFunc(frame);

    }).fail(function(e) {
        updateKey(e.status,this) //Passing this to retry after token update
    });
}

function initMasonry() {
    // Add masonry effect
    var $container = $(".masonry-grid");
    // initialize
    $container.masonry({
        percentPosition:true,
        horizontalOrder:true,
        columnWidth: ".grid-sizer",
        itemSelector: ".grid-item"
    });
}

function getRelatedArtist(artistId, callbackFunc) {

    $.ajax({
        url: "https://api.spotify.com/v1/artists/" + artistId + "/related-artists",
        headers: { "Authorization":"Bearer "+ sessionStorage.spotifyKey }
    }).done(function(data) {
        return callbackFunc(data);
    }).fail(function(e) {
        updateKey(e.status,this) //Passing this to retry after token update
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
function formatshows(bandEvents) {

    var bandsFormat = [];
    if(bandEvents.length <= 1) {
      bandsFormat[1] = $("<h2>").text("No shows found near you!!");
      return bandsFormat;
    }
    for (var i = 1; i < bandEvents.length; i++) {
      var eventObj  = bandEvents[i];
      var listItem  = $("<li>").addClass("collection-item avatar");
      var bandtitle = $("<span>").text(eventObj.title).addClass("title");

      var timeFormat = moment(eventObj.datetime_local).format("h:mma ddd, MMM DD");
      var dateTheater = timeFormat+" @ "+ eventObj.venue.name+"<br>";
      var cityState = eventObj.display_location;
      var eventHtmlFormat = $("<p>").append(dateTheater,cityState);
      var seatGeekUrl = $("<a>").addClass("secondary-content")
                        .attr("href",eventObj.url)
                        .attr("target","_blank")
                        .append($("<i>")
                                .addClass("material-icons")
                                .text("attach_money")
                        );

      listItem.append(bandtitle,eventHtmlFormat,seatGeekUrl);
      bandsFormat.push(listItem);
    }
    return bandsFormat;
  }

function seatGeekSearch(band, img, bandId) {
    eventIndex = 0;
    if (userRange === 0) {
        var bandWithoutAnd = band.replace(" & ", " ");
        var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandWithoutAnd + "&geoip=" + zipcode + "&range=" + defaultRange + "mi&per_page=" + perPage + "&client_id=" + seatgeekAPIKey;

        $.ajax({
            url: seatgeekURL,
            method: "GET"
        }).done(function(response) {
            console.log(response);
            cardCreate(band, img, bandId, response.events);
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

function cardCreate(name, image, bandId,bandEvents) {
    var uniqueId = _.uniqueId();
    var arrayIndex = uniqueId - 1;
    bandEvents.unshift(bandId);
    var formattedShows = formatshows(bandEvents);
    closeEvents[bandId] = formattedShows;
    var newCol = $("<div>").addClass("grid-item");
    var newCard = $("<div>").addClass("card hoverable");
    var imgDiv = $("<div>").addClass("card-image");
    var bandImg = $("<img>").attr("src", image).addClass("band-image");

    var cardButtons = $("<ul>").addClass("card-action-buttons").append(
        $("<li>").append(
          $("<a>").addClass("btn-floating favorite").append(
            $("<i>").addClass("material-icons").text("favorite")
          )
        ),
        $("<li>").append(
          $("<a>").attr("id", bandId)
          .addClass("btn-floating amber darken-1 spotify activator")
          .append(
            $("<i>")
              .addClass("material-icons")
              .text("volume_up")
          )
        ),
        $("<li>").append(
          $("<a>").attr("id", bandId)
          .addClass("btn-floating purple darken-1 spotify activator")
          .append(
            $("<i>")
              .addClass("material-icons")
              .html("<img src=\"/main/assets/media/images/tickets.svg\">")
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
    var revealSpan = $("<span>").addClass("card-title grey-text text-darken-4")
        .append(
          $("<i>").addClass("material-icons right text-white").text("close")
        );

    imgDiv.append(bandImg, cardButtons);
    cardContent.append(bandName);
    cardReveal.append(revealSpan);
    newCard.append(imgDiv, cardContent, cardReveal);

    newCol.append(newCard);
    $("#result").after(newCol);

    // addDates(uniqueId - 1, uniqueId);
}

function addDates(index, id) {
    $("#"+id).append("<ul>").addClass("collection");
    for (var i = 0; i < closeEvents[index].length; i++) {
        if (closeEvents[index].type === "concert" || closeEvents[index].events[i].type === "broadway_tickets_national" || closeEvents[index].events[i].type === "comedy") {

          var link = $("<a class=\"waves-effect waves-light btn\">").attr({
                  href: closeEvents[index].events[i].url,
                  target: "_blank"
              })
              .append("Tickets")
              .append("</a></span></li>");

            var eventName = $("<li>")
                .addClass("collection-item")
                .append("<span class=\"title\">"+closeEvents[index].events[i].short_title)
                .append("<p>"+closeEvents[index].events[i].date_format
                + "<br>" + closeEvents[index].events[i].venue.name
                + "<br>" + closeEvents[index].events[i].venue.display_location
                + "<br>");

            $("#" +id+ " ul").append(eventName.append(link));
        }
        $("#"+id).append("</ul>");
    }
}
