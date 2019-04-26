class idGenerator {

    constructor(idArtist = 1, idAlbum = 1, idTrack = 1){
        this.idArtist = idArtist;
        this.idAlbum = idAlbum;
        this.idTrack = idTrack;
    }

    obtainArtistId(){
        this.idArtist += 1;
        return this.idArtist - 1;
    }
}

module.exports = idGenerator;