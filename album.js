class Album{

    constructor(_name, _year){
        this.name = _name;
        this.year = _year;
        this.tracks = {};
    }

    addTrack(id, newTrack){
        for (const trackId in this.tracks) {
            const track = this.tracks[trackId];
            if (track.name === newTrack.name) throw Error (`Ya existe un track con el nombre ${newTrack.name} en este álbum`)
        }
        this.tracks[id] = newTrack;
    }

    getTracksMatchingGenres(genres) {
        const matches = [];
        for (const trackId in this.tracks) {
            const track = this.tracks[trackId];
            if (track.matchesGenres(genres)) {
                matches.push(track);
            }
        }
        return matches;
    }

    printInfo(){
        return (`--------- Album ----------
    Name:   ${this.name} 
    Year:   ${this.year}
    Tracks: ${this.printTracksInfo()}
    -------------------------- 
    `);
    }

    printTracksInfo(){
        let tracksInfo = '';
        for(const track in this.tracks){
            const myTrackName = this.tracks[track].name;
            tracksInfo = tracksInfo + '[' + myTrackName + '] ';
        }
        if(tracksInfo === ''){
            return 'No tracks available';
        }
        return tracksInfo;
    }
    
}

module.exports = Album;