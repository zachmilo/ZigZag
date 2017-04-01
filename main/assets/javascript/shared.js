"use strict"

function spotifySearch(searchQuery,artist, albums,track) {
    var artistType = artist || "";
    var albumType = albums  || "";
    var trackType = track   || "";
    
    var strippedQuery = _.replace(_.trim(searchQuery), " ","+");

    $.ajax({
        url: "https://api.spotify.com/v1/search?query="+strippedQuery+"&type=artist&offset=0&limit=20",
    }).done(function() {
        $( this ).addClass( "done" );
    }).fail(function() {
        alert( "error" );
    });
}
