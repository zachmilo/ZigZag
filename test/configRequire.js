require.config({
    shim: {
        'lodash': {
            exports: 'lodash'
        },
        'mocha': {
            exports: 'mocha'
        },
    }
});

mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true
});

// Don't track
window.expect = chai.expect;
