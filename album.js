
class Album{

    constructor(_name, _year){
        this.name = _name;
        this.year = _year;
        this.tracks = [];
    }

    printInfo(){
        return ( 
            `--------- Album ---------
            Name:   ${this.name} 
            Year:   ${this.year}
            Tracks: ${this.tracks.toArray}`
        );
    }
}

module.exports = Album;