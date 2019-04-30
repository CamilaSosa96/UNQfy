
class Playlist{

    constructor(_name, _genresToInclude, _trackList, _duration){
        this.name = _name;
        this.genresToInclude = _genresToInclude;
        this.tracks = _trackList;
        this.duration = _duration;
    }

    printInfo(){
        return (`-------- PlayList --------
    Name:     ${this.name} 
    Genres:   ${this.printGenres()}
    Tracks:   ${this.printTracksInfo()}
    Duration: ${this.calculateDuration()} seconds
    -------------------------- 
    `);
    }

    printTracksInfo(){
        let tracksInfo = '';
        for(const track in this.tracks){
            const myTrackName = this.tracks[track].name;
            tracksInfo = tracksInfo + '[' + myTrackName + '] ';
        }
        return tracksInfo;
    }

    printGenres(){
        let genresInfo = '';
        for (const genre in this.genresToInclude){
            const myGenre = this.genresToInclude[genre];
            genresInfo = genresInfo + '[' + myGenre + '] ';
        }
        return genresInfo;
    }

    calculateDuration(){
        let duration = 0;
        for(const track in this.tracks){
            duration = duration + (parseInt(this.tracks[track].duration));
        }
        return duration
    }

    hasTrack(track){
        this.tracks.includes(track);
    }

    deleteTrack(track){
        this.tracks.splice(this.tracks.indexOf(track), 1);
    }
}

module.exports = Playlist;