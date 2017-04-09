var expect = chai.expect;
var assert = chai.assert;

describe("Spotify", function() {
     describe("searchQuery()", function() {
        it("Should return a band from query", function(done) { // added "done" as parameter
            spotifySearch("The Beatles", function(result) {
                try {
                    assert.isAbove(result.artists.total,0);
                    done();
                }
                catch(e) {
                    done(e);
                }
            });
        });
    });
});
