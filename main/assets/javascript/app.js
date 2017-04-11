"use strict"

$(() => {
    //Main Page
    $('#main_button').on('click', function(event) {
        event.preventDefault();
        quickValidate($('#band_name').val().trim(), $('#location').val().trim());
    })

    //Results Page
    $(".dropdown-button").dropdown();
    //pulse effect for spotify activator playlist button
    $('body').on('mouseenter', '.card-action-buttons a', function() {
        $(this).addClass('pulse');
    }).on('mouseleave', '.card-action-buttons a', function() {
        $(this).removeClass('pulse');
    }).on('click', '.card-action-buttons a', function() {
        $(this).removeClass('pulse');
    })

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

    $('#new_band_name').val(sessionStorage.getItem('Hear+Now:bandName'));
    $('#new_location').val(sessionStorage.getItem('Hear+Now:location'));

    $('.modal').modal();

    $('body').on('click', '.spotify', function(){
    	var _that = $(this);
    	console.log($(this).attr('id'));
    	spotifyIFrame($(this).attr('id'), function(frame) {
    		console.log(_that);
    		console.log(_that.closest('card-image').next().next());
    		_that.closest('.card-image').next().next().append(frame);
    		console.log(frame);
    	})
    })
})

function setSessionStorage(bandName, location) {
    sessionStorage.setItem('Hear+Now:bandName', bandName);
    sessionStorage.setItem('Hear+Now:location', location);
}

function loadNewResults() {
	setSessionStorage($('#band_name').val().trim(), $('#location').val().trim());
	window.open("results.html", "_self");
}

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
    }).done(function(data) {
        if (data.artists.total != 0 && location) {
            loadNewResults();
        } else if (data.artists.total === 0) {
            $('#band_name').val('');
            $('#band_name').attr('placeholder', 'PLEASE ENTER A VALID BAND NAME');
        }
    }).fail(function(e) {
        console.log("An error occurred trying with search query" + e);
    });
}
