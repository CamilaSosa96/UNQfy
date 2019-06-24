const creds = require('./spotifyCreds');
const promisify = require('util').promisify;

class SpotifyAPIClient{

    //------------------- REQUESTS --------------------//

    obtainAlbumNamesForArtist(artistName, callback) {
        const rp = require('request-promise');
        const getId = promisify(SpotifyAPIClient.obtainArtistID);
        const promisedID = getId(artistName);
        promisedID.then((id) => {
            const options = {
                url: `https://api.spotify.com/v1/artists/${id}/albums`,
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
        });
    }

    static obtainArtistID(artistName, callback){
        const rp = require('request-promise');
        const options = {
            url: `https://api.spotify.com/v1/search?q=${artistName}&type=artist`,
            headers: { Authorization: 'Bearer ' + creds.access_token},
            json: true,
        };
        rp.get(options).then((response) => {
            callback(null, response.artists.items[0].id);
        }).catch((err) => {callback(err, null);});
    }
}

module.exports = SpotifyAPIClient;