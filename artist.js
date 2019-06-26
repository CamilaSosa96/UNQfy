 class Artist {
    constructor(_id, _name, _country = 'No available'){
        this.id = _id;
        this.name = _name;
        this.albums = [];
        this.country = _country;
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
        if(!this.albumAlreadyExists(album.name)){
            this.albums[albumId] = album;
        }
    }

    albumAlreadyExists(albumName){
        for (const albumId in this.albums){
          if(this.albums[albumId].name === albumName){
            throw new Error (`Album ${albumName} already exists!`);
          } 
        }
        return false;
      }

    deleteAlbumIfExists(album){
        const albumToDelete = album;
        for(const albumId in this.albums){
            const myAlbum = this.albums[albumId];
            if(albumToDelete === myAlbum){
                delete this.albums[albumId];
            }
        }
    }

    updateInfo(name, country){
        this.name = name;
        this.country = country;
    }

    toJSON(){
        const myAlbums = [];
        for(const albumsID in this.albums){
            myAlbums.push(this.albums[albumsID]);
        }
        return {
            id: this.id,
            name: this.name,
            albums: myAlbums,
            country: this.country
        };
    }
 }

 module.exports = Artist;