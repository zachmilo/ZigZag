"use strict"

/*
* Allow you to search spotify api.
* This search can do artist, albums, and track
* returns: the search results
 */
function spotifySearch(searchQuery, callbackFunc) {

    var buildQuery = _.replace(_.trim(searchQuery), " ","+");

    $.ajax({
        url: "https://api.spotify.com/v1/search?query="+buildQuery+"&type=artist&offset=0&limit=20",
    }).done(function(data) {
        return callbackFunc(data);
    }).fail(function(e) {
        console.log( "An error occured trying with search query"+ e );
    });
}

function spotifyIFrame(artistId, callbackFunc) {

    var albumId = "";
    $.ajax({
        url: "https://api.spotify.com/v1/artists/"+artistId+"/albums",
    }).done(function(data) {
        var albumId = Math.floor((Math.random() * data.items.length));
        var iSrc = "https://embed.spotify.com/?uri=spotify%3Aalbum%3A"+data.items[albumId].id+"&theme=white"
        var frame = $("<iframe>");

        $(frame).attr("src",iSrc);
        $(frame).css({"width":"100%", "height":"80", "frameborder":"0", "allowtransparency":"true"})

        return callbackFunc(frame);

    }).fail(function(e) {
        console.log( "An error occured trying to get album"+ e );
    });
}

function getRelatedArtist(artistId, callbackFunc) {

    $.ajax({
        url: "https://api.spotify.com/v1/artists/"+artistId+"/related-artists",
    }).done(function(data) {
        console.log(data);
        return callbackFunc(data);
    }).fail(function(e) {
        console.log( "Getting related artist failed"+ e );
    });
}
