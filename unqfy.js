const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./artist');
const IdGenerator = require('./idGenerator');
const IdIterator = require('./idIterator');
const Track = require('./track');

class UNQfy {

  constructor(){
    this.artists = {};
    this.playlists = {};
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
  }

  addTrack(albumId, trackData) {
    const myTrack = new Track(trackData.name, trackData.duration, trackData.genres);
    try{
      const myAlbum = this.getAlbumById(albumId)
      const id = this.idGenerator.obtainId('track'); 
      myAlbum.addTrack(id, myTrack)
      console.log(` ${trackData.name} created succesfully!`);
      return myTrack;
    } catch (exception){ 
      console.log('Invalid track: ' + exception.message);
    }
  }

  getArtistById(id) {

  }

  getAlbumById(id) {
    for (const artistId in this.artists) {
      const artist = this.artists[artistId];
      const myAlbum = artist.albums[id];
      if(myAlbum !== undefined){
        return myAlbum;
      }
    }
    throw Error(`El album con Id ${id} no existe`);
  }

  getTrackById(id) {
    for (const artistId in this.artists) {
      const artist = this.artists[artistId];
      for(const albumId in artist.albums){
        const album = artists.albums[albumId];
        const myTrack = album.tracks[id];
        if(myTrack !== undefined){
          return myTrack;
        }
      }
    }
    throw Error(`El track con Id ${id} no existe`);
  }

  getPlaylistById(id) {
    return this.playlists[id];
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    let matches = [];
    for (const artistId in this.artists) {
      const artist = this.artists[artistId];
      matches = matches.concat(artist.getTracksMatchingGenres(genres));
    }
    return matches;
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

