firebase.initializeApp(config);

var database = firebase.database();

$(".favorite").on("click", function() {
    var bandName = $(".card-title").text();
    // var Destination = $('#destination').val().trim();
    // var First = moment($('#First').val().trim(), "HH:mm").format("X");
    // var Frequency = $('#frequency').val().trim();
    // if (Name != "" && Destination != "" && First != "" && Frequency != "") {
        database.ref().push({
            name: bandName,
            // dest: Destination,
            // first: First,
            // freq: Frequency,
        });
        alert("Train successfully added!");

        // Note to self: If time, add sound effect of train whistle. See for reference http://stackoverflow.com/questions/29992822/having-audio-play-on-click?rq=1
    } else {
        alert("Please complete each missing field.");
    };
    $('#Name').val("");
    $('#destination').val("");
    $('#First').val("");
    $('#frequency').val("");

    return false;
});

database.ref().on("child_added", function(snapshot) {

    var Name = snapshot.val().name;
    var Destination = snapshot.val().dest;
    var trainFirst = snapshot.val().first;
    var trainFrequency = snapshot.val().freq;
    var currentTime = moment();
    var currentTimeConverted = moment(currentTime).format("X");
    var firstTimePushed = moment(trainFirst, "X").subtract(1, "days");
    var diffTime = moment(currentTimeConverted, "X").diff(moment(firstTimePushed, "X"), "minutes");
    var trainRem = diffTime % trainFrequency;
    var trainWait = trainFrequency - trainRem;
    var nextTrain = moment().add(trainWait, "minutes");
    if (currentTimeConverted > trainFirst) {
        $("#table > tbody").append("<tr><td>" + Name + "</td><td>" +
            Destination + "</td><td>" +
            trainFrequency + "</td><td>" +
            moment(nextTrain).format("hh:mm A") + "</td><td>" +
            trainWait + "</td></tr>");

    } else {

        $("#table > tbody").append("<tr><td>" + Name + "</td><td>" +
            Destination + "</td><td>" +
            trainFrequency + "</td><td>" +
            moment(trainFirst, "X").format("hh:mm A") + "</td><td>" +
            trainWait + "</td></tr>");
    }
}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code)
})

// Note to self: If time convert minutes of nextTrain to hours and minutes, if applicable. See for reference http://stackoverflow.com/questions/36035598/how-to-convert-minutes-to-hours-using-moment-js
