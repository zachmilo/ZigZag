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
        artistDataResult = data;
        return data;
    }).fail(function(e) {
        console.log( "An error occured trying with search query"+ e );
    });
}

function spotifyIFrame(albumId) {

    var iSrc = "https://embed.spotify.com/?uri=spotify%3Aalbum%3A"+album+"&theme=white"
    var frame = $("<iframe>");

    $(frame).attr("src",iSrc);
    $(frame).css({"width":"100%", "height":"80", "frameborder":"0", "allowtransparency":"true"})

    $("#band_name").append(frame);
    //.albums.items["0"].id
}

function getRelatedArtist(artistId) {
    $.ajax({
        url: "https://api.spotify.com/v1/artists/"+artistId+"/related-artists",
    }).done(function(data) {
        console.log(data);
        relatedArtists = data;
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
