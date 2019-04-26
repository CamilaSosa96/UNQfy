
class Track{

    constructor(_name, _duration, _genres){
        this.name = _name;
        this.duration = _duration;
        this.genres = _genres;
    }

    printInfo(){
        return ( 
            `--------- Track ---------
            Name:     ${this.name} 
            Duration: ${this.duration} seconds
            Genres:   ${this.genres.toArray}`
        );
    }
}

module.exports = Track;