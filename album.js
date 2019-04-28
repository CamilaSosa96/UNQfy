
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

    printInfo(){
        return (`--------- Album ---------
        Name:   ${this.name} 
        Year:   ${this.year}
        Tracks: ${this.printTracksInfo()}
        -------------------------- 
        `
        );
    }

    printTracksInfo(){
        if(this.tracks.toArray === undefined){
            return 'No available';
        }
        return this.tracks.toArray;
    }
    
}

module.exports = Album;