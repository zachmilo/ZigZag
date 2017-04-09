var expect = chai.expect;
var spotify = 
describe('Spotify API calls', function() {
  describe('#spotifySearch', function() {
    it('Should return result of search', function() {
        var result = spotifySearch("The Beatles");
       expect(result).to.equal(result.artists.total > 1);
    });
  });
});
