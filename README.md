https://travis-ci.org/zachmilo/ZigZag.svg?branch=travis_ci


TO INTALL DEPENDENCIES GO TO REPO AND DO "npm install"

#Below is the currently installed packages


```
{
  "name": "zigzag",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/zachmilo/ZigZag.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/zachmilo/ZigZag/issues"
  },
  "homepage": "https://github.com/zachmilo/ZigZag#readme",
  "dependencies": {
    "firebase": "^3.7.4",
    "jquery": "^3.2.1",
    "lodash": "^4.17.4",
    "materialize-css": "^0.98.1",
    "mocha": "^3.2.0"
  }
}
```
<!-- Firebase -->
# FirebaseUI for web - Auth Demo

Accessible here:
[https://fir-ui-demo-84a6c.firebaseapp.com](https://fir-ui-demo-84a6c.firebaseapp.com).

## Prerequisite

You need to have created a Firebase Project in the
[Firebase Console](https://firebase.google.com/console/) as well as configured a web app.

## Installation

Install the firebase command line tool with `npm install -g firebase-tools` (See
[docs](https://firebase.google.com/docs/cli/#setup)).

Enable the Auth providers you would like to offer your users in the console, under
Auth > Sign-in methods.

Run:

```bash
git clone https://github.com/firebase/firebaseui-web.git
cd firebaseui-web/demo
```

This will clone the repository in the current directory.

If you want to be able to deploy the demo app to one of your own Firebase Hosting instance,
configure it using the following command:

```bash
firebase use --add
```

Select the project you have created in the prerequisite, and type in `default` or
any other name as the alias to use for this project.

Copy `public/sample-config.js` to `public/config.js`:

```bash
cp public/sample-config.js public/config.js
```

Then copy and paste the Web snippet code found in the console (either by clicking "Add Firebase to
your web app" button in your Project overview, or clicking the "Web setup" button in the Auth page)
in the `config.js` file.

## Deploy

To deploy the demo app, run the following command in the root directory of FirebaseUI (use `cd ..`
first if you are still in the `demo/` folder):

```bash
npm run demo
```

This will compile all the files needed to run FirebaseUI, and start a Firebase server locally at
http://localhost:5000.
