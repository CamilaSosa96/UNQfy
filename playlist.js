
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
    Tracks:   ${this.tracks.toArray}
    Duration: ${this.duration}
    -------------------------- 
    `);
    }
}

module.exports = Playlist;