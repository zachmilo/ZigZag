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
