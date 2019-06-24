
const MusicxMatchAPIClient = require('./musixmatchAPIClient');
const promisify = require('util').promisify;
class Track{

    constructor(_name, _duration, _genres){
        this.name = _name;
        this.duration = _duration;
        this.genres = _genres;
        this.lyrics = null;
    }

    matchesGenres(searchGenres) {
        for (let i = 0; i < searchGenres.length; i++) {
            const searchGenre = searchGenres[i];
            if (this.genres.indexOf(searchGenre) !== -1) {
                return true;
            }
        }
        return false;
    }

    getLyrics(track, callback){
        if(track.lyrics !== null){
            callback(null, track.lyrics);
        } else {
            const musixmatch = new MusicxMatchAPIClient();
            const obtainLyrics = promisify(musixmatch.obtainLyricsForTrack);
            const promisedLyrics = obtainLyrics(track.name);
            promisedLyrics.then((lyrics) => {
                track.lyrics = lyrics;
                callback(null, track.lyrics);
                }).catch((err) => {callback(err, null);});
        }
    }

    printInfo(){
        return (`--------- Track ----------
    Name:     ${this.name} 
    Duration: ${this.duration} seconds
    Genres:   ${this.printGenresInfo()}
    Lyrics:   ${this.printLyrics()}
    -------------------------- 
    `);
    }

    printGenresInfo(){
        let genresInfo = '';
        for(const genre in this.genres){
            genresInfo = genresInfo + '[' + this.genres[genre] + '] ';
        }
        if(genresInfo === ''){
            return 'No genres available';
        }
        return genresInfo;
    }

    printLyrics(){
        if(this.lyrics === null){
            return 'No lyrics available';
        }
        return this.lyrics;
    }
}

module.exports = Track;