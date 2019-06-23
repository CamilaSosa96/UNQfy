const creds = require('./spotifyCreds');
const resolve = require('promise').resolve;


class SpotifyAPIClient{

    //------------------- REQUESTS --------------------//

    obtainAlbumNamesForArtist(artistName, callback) {
        const rp = require('request-promise');
        const promisedID = '6olE6TJLqED3rqDCT0FyPh'; // const promisedID = this.obtainArtistSpotifyID(artistName) Harcoded ID (Nirvana)
        
        const options = {
            url: `https://api.spotify.com/v1/artists/${promisedID}/albums`,
            headers: { Authorization: 'Bearer ' + creds.access_token},
            json: true,
        };
        rp.get(options).then((response) => {
            const albums = response.items;
            const albumNames = [];
            for(let i=0; i < albums.length ;i++){
                albumNames.push(albums[i].name);
            }
            callback(null, albumNames);
        }).catch((err) => {callback(err,null);});
    } 
}

module.exports = SpotifyAPIClient;