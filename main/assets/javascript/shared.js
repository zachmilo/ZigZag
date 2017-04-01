"use strict"

function spotifySearch(searchQuery,artist, albums,track) {
    var artistType = artist || true;
    var artistType = albums || false;
    var artistType = track  || false;

    formatSearch(searchQuery);

    $.ajax({
        url: "https://api.spotify.com/v1/search?query=white+denim&type=artist&offset=0&limit=20",
    }).done(function() {
        $( this ).addClass( "done" );
    }).fail(function() {
        alert( "error" );
    });
}

function formatSearch(searchQuery) {
    
}
