 class Artist {
    constructor(_name, _country){
        this.name = _name;
        this.country = _country;
        this.albums = [];
    }
    
    printInfo(){
        return ( 
            `--------- Artist ---------
            Name:    ${this.name} 
            Country: ${this.country}
            Albums:  ${this.albums.toArray}`
        );
    }
 }

 module.exports = Artist;