
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
    Duration: ${this.duration}
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
}

module.exports = Playlist;