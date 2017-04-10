require.config({
    shim: {
        'lodash': {
            exports: 'lodash'
        },
        'mocha': {
            exports: 'mocha'
        },
    },
    paths: {
        'chai': '../node_modules/chai/chai',
        'mocha': '../node_modules/mocha/mocha',
    }
});
mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true
});

// Don't track
window.expect = chai.expect;
