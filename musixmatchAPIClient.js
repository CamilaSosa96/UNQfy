const promisify = require('util').promisify;

class MusixMatchAPIClient {

    obtainLyricsForTrack(trackName, callback){
        const rp = require('request-promise');
        const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
        const getTrackID = promisify(MusixMatchAPIClient.obtainIDForTrack);
        const promisedID = getTrackID(trackName);
        promisedID.then((id) =>{
            const options = {
                url: BASE_URL + `/track.lyrics.get?track_id=${id}`,
                qs: {
                    apikey: '2f8501f6811cfa4d2007726c12d9d33b',
                },
                json: true
            };
    
            rp.get(options).then((response) => {
                const lyrics = response.message.body.lyrics.lyrics_body;
                callback(null, lyrics);
            });
        }).catch((error) => {callback(error, null);});
    }

    static obtainIDForTrack(trackName, callback){
        const rp = require('request-promise');
        const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
        const options = {
            url: BASE_URL + '/track.search',
            qs: {
                apikey: '2f8501f6811cfa4d2007726c12d9d33b',
                q_track: trackName,
                f_has_lyrics: true,
                s_track_rating: true,
            },
            json: true
        };

        rp.get(options).then((response) => {
            const body = response.message.body;
            if(body.track_list[0] === undefined){
                throw new Error(`Track with name ${trackName} not found!`);
            }
            callback(null, body.track_list[0].track.track_id);
        }).catch((error) => {callback(error, null);});
    }
}

module.exports = MusixMatchAPIClient;