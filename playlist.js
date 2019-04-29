
class Playlist{

    constructor(_name, _genresToInclude, _trackList, _duration){
        this.name = _name;
        this.genresToInclude = _genresToInclude;
        this.tracks = _trackList;
        this.duration = _duration;
    }

    printInfo(){
        return (`--------- PlayList ---------
    Name:     ${this.name} 
    Genres:   ${this.genresToInclude}
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
}

module.exports = Playlist;