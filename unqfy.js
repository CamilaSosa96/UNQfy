const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./artist');
const Album = require('./album');
const IdGenerator = require('./idGenerator');
const IdIterator = require('./idIterator');

class UNQfy {

  constructor(){
    this.artists = [];
    this.playlists = [];
    this.idGenerator = new IdGenerator(['artist', 'album', 'track', 'playlist']);
  }
  
  addArtist(artistData) {  
    const myArtist = new Artist(artistData.name, artistData.country);
    try{
      if(!this.artistAlreadyExists(artistData.name)){
        const id = this.idGenerator.obtainId('artist'); 
        this.artists[id] = myArtist;
        console.log(`Artist ${artistData.name} created succesfully!`);
        return myArtist;
      }
    } catch (exception){ 
      console.log('Invalid artist: ' + exception.message);
    }
  }

  artistAlreadyExists(artistName){
    for (let i = 0; i< this.artists.length; i++){
      const myArtist = this.artists[i];
      if((myArtist !== undefined) && (this.artists[i].name === artistName)){
        throw new Error(`Artist ${artistName} already exists!`);
      }
    }
    return false;
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
 const myAlbum = new Album(albumData.name, albumData.year);
 const result = this.getArtistById(artistId);
    try{
      if(result != null){
        const albumId = this.idGenerator.obtainId('album'); 
        this.artists[artistId].addAlbum(album,albumId);
        return myAlbum;
        console.log(`Album ${albumData.name} added to Artist with id ${artistId} succesfully!`);
      }
    } catch (exception){ 
      console.log('Invalid artist id: ' + exception.message);
    }
  }
  


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
  }

  getArtistById(id) {
    const artist = this.artists[id];
    
    if((artist !== undefined)){
          return artist;
    }
    else{
    throw new Error(`Artist with id ${id} doesnt exist!`);
    }

  }

  getAlbumById(id) {

  }

  getTrackById(id) {
    for(const artist in this.artists){
      for(const album in artist.albums){
        const myTrack = album.tracks[id];
        if(myTrack !== undefined){
          return myTrack;
        }
      }
    }
  }

  getPlaylistById(id) {
    return this.playlists[id];
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

  }

  // artistId: id de artista
  // retorna: los tracks interpretados por el artista con id artistId
  getTracksMatchingArtist(artistId) {
    let tracks = [];
      for (const album in this.artists[artistId].albums){
        tracks = tracks + album.tracks;
      }
    }

  searchEntity(string){
    const results = [];
    for (const artist in this.artists){
      const myArtist = this.artists[artist];
      this.addToListIfMatches(results, myArtist, string);
      for(const album in artist.albums){
        const myAlbum = artist.albums[album];
        this.addToListIfMatches(results, myAlbum, string);
        for(const track in album.tracks){
          const myTrack = album.tracks[track];
          this.addToListIfMatches(results, myTrack, string);
        }
      }
    }
    for (const playlist in this.playlists){
      const myPlaylist = this.playlists[playlist];
      this.addToListIfMatches(results, myPlaylist, string);
    }
    console.log(`Results:            
   ${this.printResults(results)}`);
  }

  addToListIfMatches(results, entity, string){
    if(entity.name.includes(string)){
      results.push(entity);
    }
  }

  printResults(results){
    let printedResults = ' ';
    for (const result in results){
      const myResult = results[result];
      printedResults = printedResults + myResult.printInfo();
    }
    return printedResults;
  }

  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, IdGenerator, IdIterator];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

