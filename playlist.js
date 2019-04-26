
class Playlist{

    constructor(_name, _genresToInclude, _maxDuration){
        this.name = _name;
        this.genresToInclude = _genresToInclude;
        this.tracks = [];
        this.maxDuration = _maxDuration;
    }

    printInfo(){
        return ( 
            `--------- PlayList ---------
            Name:     ${this.name} 
            Genres:   ${this.duration}
            Tracks:   ${this.tracks.toArray}
            Duration: ${this.maxDuration}`
        );
    }
}

module.exports = Playlist;