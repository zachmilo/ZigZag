"use strict"

$(() => {

    //Main Page
    $('#main_button').on('click', function(event) {
        event.preventDefault();
        validateSearch($('#band_name').val().trim(), $('#location').val().trim());
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
        validateSearch($('#band_name').val().trim(), $('#location').val().trim());
    })

    //Sign-in buttons
    $('.sign-in').on('click', function() {
        //Clear any previous errors
        $('#auth-error').text('');
    })

    //Auth Modal click events
    $('#sign-up').on('click', function(event) {
        var email = $('#email').val().trim();
        var password = $('#password').val().trim();
        handleSignUp(email, password, function(success) {
            $('#auth-modal').modal('close');
        }, function(failure) {
            $('#auth-error').text(failure);
        });
    })

    $('#sign-in').on('click', function(event) {
        var email = $('#email').val().trim();
        var password = $('#password').val().trim();
        toggleSignIn(email, password, function(success) {
            $('#auth-modal').modal('close');
        }, function(failure) {
            $('#auth-error').text(failure);
        });
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

    //Enable search and auth modal
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
