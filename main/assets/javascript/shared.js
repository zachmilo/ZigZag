"use strict"
/*
* Allow you to search spotify api.
* This search can do artist, albums, and track
* returns: the search results
 */
function spotifySearch(searchQuery,artist, albums,track) {
    var artistType = artist+"&"  || "";
    var albumType  = albums+"&"  || "";
    var trackType  = track+"&"   || "";

    var strippedQuery = _.replace(_.trim(searchQuery), " ","+");

    $.ajax({
        url: "https://api.spotify.com/v1/search?query="+strippedQuery+"&type=artist&offset=0&limit=20",
    }).done(function() {
        $( this ).addClass( "done" );
    }).fail(function(e) {
        alert( "the following error has occured"+ e );
    });
}

function spotifyIFrame() {

}
/*
<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%3A33Q6ldVXuJyQmqs8BmAa0k&theme=white" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>
 */
