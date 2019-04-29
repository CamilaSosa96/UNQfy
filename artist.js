 class Artist {
    constructor(_name, _country = 'No available'){
        this.name = _name;
        this.country = _country;
        this.albums = {};
    }

    getTracksMatchingGenres(genres) {
        let matches = [];
        for (const albumId in this.albums) {
            const album = this.albums[albumId];
            matches = matches.concat(album.getTracksMatchingGenres(genres));
        }
        return matches;
    }
    
    printInfo(){
        return (`--------- Artist --------- 
    Name:    ${this.name} 
    Country: ${this.country}
    Albums:  ${this.printAlbumsInfo()}
    -------------------------- 
    `
        );
    }

    printAlbumsInfo(){
        if(this.albums.toArray === undefined){
            return 'No available';
        }
        return this.albums.toArray;
    }

    addAlbum(album,albumId){
        this.albums[albumId] = album;
    }
 }

 module.exports = Artist;