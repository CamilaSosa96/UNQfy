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
    `);
    }

    printAlbumsInfo(){
        let albumInfo = '';
        for(const album in this.albums){
            const myAlbumName = this.albums[album].name;
            albumInfo = albumInfo + '[' + myAlbumName + '] ' ;
        }
        if(albumInfo === ''){
            return 'No albums available';
        }
        return albumInfo;
    }

    addAlbum(album,albumId){
        this.albums[albumId] = album;
    }

    deleteAlbum(albumId){
        delete this.albums[albumId];
    }

    hasAlbum(searchAlbum){
        for (const albumId in this.albums){
            const album = this.albums[albumId];
            if (album == searchAlbum) return true;                
        }
        return false;
    }
 }

 module.exports = Artist;