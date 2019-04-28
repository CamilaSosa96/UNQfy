 class Artist {
    constructor(_name, _country = 'No available'){
        this.name = _name;
        this.country = _country;
        this.albums = {};
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
        this.albums[albumId].push(album);
    }
 }

 module.exports = Artist;