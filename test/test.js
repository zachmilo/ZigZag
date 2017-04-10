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

    describe("spotifyIFrame", function() {
       it("Should build an iframe", function(done) { // added "done" as parameter
           spotifyIFrame("3WrFJ7ztbogyGnTHbHJFl2", function(frame) {
               try {
                  expect(frame).to.be.an('object');
                   done();
               }
               catch(e) {
                   done(e);
               }
           });
       });
   });

   describe("getRelatedArtist", function() {
      it("Should return related artist", function(done) { // added "done" as parameter
          getRelatedArtist("3WrFJ7ztbogyGnTHbHJFl2", function(result) {
              try {
                 assert.isAbove(result.artists.length,0);
                  done();
              }
              catch(e) {
                  done(e);
              }
          });
      });
  });

});
