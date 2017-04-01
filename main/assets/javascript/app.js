"use strict"


function seatGeekSearch() {
    // var bandName = $(this).attr("data-band");
    // var zipcode = 0;
    // var range = 0;
    // 


    var zipcodeAPIKey = ZipCodeConfig.apiKey;
    var seatgeekAPIKey = SeatGeekConfig.apiKey;
    var bandName = "dinosaur";
    var closeEvents = [];
    var relatedBands = [];
    var zipcode = 27502;
    var venueZip = 0;
    var range = 30;
    var defaultRange = 200;
    var userRange = 0;

    if (userRange === 0) {
    	console.log("here at 0");
        for (var i = 0; i < defaultRange; i += 100) {


            var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandName + "&geoip=" + zipcode + "&range=" + range + "mi&client_id=" + seatgeekAPIKey;

            $.ajax({
                url: seatgeekURL,
                method: "GET"
            }).done(function(response) {


                var zipcodeURL = "https://www.zipcodeapi.com/rest/" + zipcodeAPIKey + "/distance.json/" + zipcode + "/" + venueZip + "/mile";

                console.log(response);

                for (var j = 0; j < response.events.length; j++) {
                    if (response.events[j].type === "concert") {
                    	console.log("concert!");

                    	closeEvents.push(response.events[j]);
                    	console.log(closeEvents);
                    	console.log(closeEvents[0].id);

                    }

                }

            });
        }
    } else {
        for (var i = 0; i < userRange; i += 5) {

            var zipcodeURL = "https://www.zipcodeapi.com/rest/" + zipcodeAPIKey + "/distance.json/" + zipcode + "/" + venueZip + "/mile";
            var seatgeekURL = "https://api.seatgeek.com/2/events?q=" + bandName + "geoip=" + zipcode + "&range=" + range + "&client_id=" + seatgeekAPIKey;

            $.ajax({
                url: seatgeekURL,
                method: "GET"
            }).done(function(response) {

                console.log(response);

                for (var j = 0; j < response.events.length; j++) {
                    if (response.events[j].type === "concert") {


                    }

                }

            });

        }
    }
}

seatGeekSearch();