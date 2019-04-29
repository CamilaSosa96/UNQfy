
class Track{

    constructor(_name, _duration, _genres){
        this.name = _name;
        this.duration = _duration;
        this.genres = _genres;
    }

    matchesGenres(searchGenres) {
        for (let i = 0; i < searchGenres.length; i++) {
            const searchGenre = searchGenres[i];
            if (this.genres.indexOf(searchGenre) != -1) {
                return true;
            }
        }
        return false;
    }

    printInfo(){
        return (`--------- Track ---------
        Name:     ${this.name} 
        Duration: ${this.duration} seconds
        Genres:   ${this.genres.toArray}
        -------------------------- 
        `
        );
    }
}

module.exports = Track;