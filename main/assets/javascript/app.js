"use strict"

hasKey();

$(() => {
    //Main Page
    $('#main_button').on('click', function(event) {
            event.preventDefault();
            quickValidate($('#band_name').val().trim(), $('#location').val().trim());
        })
    //Results Page
    //Pulse effect for spotify activator playlist button
    $('body').on('mouseenter', '.card-action-buttons a', function() {
            $(this).addClass('pulse');
        }).on('mouseleave', '.card-action-buttons a', function() {
            $(this).removeClass('pulse');
        }).on('click', '.card-action-buttons a', function() {
            $(this).removeClass('pulse');
        })
    //Add or remove the pink class and the favorite property to the heart icon when clicked
    $('body').on('mouseenter', 'a.favorite', function() {
            if (!$(this).prop('favorite')) {
                $(this).addClass('pink')
            }
        }).on('mouseleave', 'a.favorite', function() {
            if (!$(this).prop('favorite')) {
                $(this).removeClass('pink')
            }
        }).on('click', 'a.favorite', function() {
            if (!$(this).prop('favorite')) {
                $(this).addClass('pink')
                    .prop('favorite', true);
            } else {
                $(this).removeClass('pink')
                    .prop('favorite', false)
                    .css('background-color', 'lightgray');
            }
        })
    //Go! button on search modal
    $('#new-search').on('click', function(event) {
            event.preventDefault();
            quickValidate($('#band_name').val().trim(), $('#location').val().trim());
        })
    //Auth Modal click events
    $('#sign-up').on('click', function(event) {
        event.preventDefault();
        handleSignUp();
    })
    $('#sign-in').on('click', function(event) {
        event.preventDefault();
        toggleSignIn();
    })
    $('#verify-email').on('click', function(event) {
        event.preventDefault();
        sendEmailVerification();
    })
    $('#password-reset').on('click', function(event) {
            event.preventDefault();
            sendPasswordReset();
    })

    //Populate the forms fields on the search modal with the previous input
    $('#band_name').val(sessionStorage.getItem('Hear+Now:bandName'));
    $('#location').val(sessionStorage.getItem('Hear+Now:location'));
    //Enable the modal
    $('.modal').modal();
    //Populate the iframe when the volume_up icon is clicked
    $('body').on('click', '.spotify', function() {
        var cardReveal = $(this).closest('.card-image').next().next();
        if (cardReveal.children('iframe').length === 0) {
            //If there isn't already an iframe when clicked, create one
            spotifyIFrame($(this).attr('id'), function(frame) {
                cardReveal.append(frame);
            })
        }
    })
})

function setSessionStorage(bandName, location) {
    sessionStorage.setItem('Hear+Now:bandName', bandName);
    sessionStorage.setItem('Hear+Now:location', location);
}

function hasKey() {
  if(!sessionStorage.spotifyKey) {
    $.ajax({
        url: "/spotifyId"
    }).done(function(data) {
      sessionStorage.spotifyKey = data.access_token;

    }).fail(function(e) {
        console.log("Getting key failed because " + JSON.stringify(e));
    });
  }
}

function loadNewResults(id, images) {
    setSessionStorage($('#band_name').val().trim(), $('#location').val().trim());
    window.open("results.html", "_self");
}

//Validate the band name with Spotify and the zipcode with regex
function quickValidate(bandName, location) {
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
        headers: { "Authorization":"Bearer "+ sessionStorage.spotifyKey }
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
