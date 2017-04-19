firebase.initializeApp(firebaseConfig);



/**
 * Handles the sign in button press.
 */
function toggleSignIn(email, password, onSucess, onFailure) {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        if (email.length < 4) {
            return onFailure('Please enter a valid email address.');
        }
        if (password.length < 4) {
            return onFailure('Please enter a valid password.');
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(data) {
            return onSucess(true);
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                return onFailure('Wrong password.');
            } else {
                return onFailure(errorMessage);
            }
            console.log(error);
            document.getElementById('sign-in').disabled = false;

            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    document.getElementById('sign-in').disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp(email, password, onSucess, onFailure) {
    if (email.length < 4) {
        return onFailure('Please enter a valid email address.');
    }
    if (password.length < 4) {
        return onFailure('Please enter a longer password.');
    }
    // Sign in with email and pass.<div></div>
    // [START createwithemail]

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        sendEmailVerification();
        return onSucess(true)
    }).catch(function(error) {
        // Handle Errors here.
                console.log(error);
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            return onFailure('The password is too weak.');
        } else if (errorCode == 'auth/invalid-email') {
            return onFailure('Please enter a valid email address.');
        } else {
            return onFailure(errorMessage);
        }

        // [END_EXCLUDE]
    });
    // [END createwithemail]
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    console.log('Initializing firebase auth ...')
    firebase.auth().onAuthStateChanged(function(user) {
        console.log('User state change ' + user);
        // [START_EXCLUDE silent]
        // document.getElementById('verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user != null) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            // document.getElementById('sign-in-status').textContent = 'Signed in';
            document.getElementById('sign-in').textContent = 'Sign out';
            // document.getElementById('account-details').textContent = JSON.stringify(user, null, '  ');
            if (!emailVerified) {
                // document.getElementById('verify-email').disabled = false;
            }
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            // document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            // document.getElementById('account-details').textContent = 'null';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('sign-in').disabled = false;

        // [END_EXCLUDE]
    });
    // [END authstatelistener]
}

window.onload = function() {
    console.log('Firebase loaded ...');
    initApp();
};
