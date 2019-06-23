const picklify = require('picklify');
const fs = require('fs');
const Artist = require('./artist');
const Album = require('./album');
const IdGenerator = require('./idGenerator');
const IdIterator = require('./idIterator');
const Track = require('./track');
const Playlist = require('./playlist');
const promisify = require('util').promisify;
const SpotifyAPIClient = require('./spotifyAPIClient');

class UNQfy {

  constructor(){
    this.artists = {};
    this.playlists = {};
    this.idGenerator = new IdGenerator(['artist', 'album', 'track', 'playlist']);
  }
  
  //------------------- Calls to Spotify/MusicxMatch API's -------------------//

  populateAlbumsForArtist(artistName, unqfy, callback){
    const spotify = new SpotifyAPIClient();
    const obtainAlbums = promisify(spotify.obtainAlbumNamesForArtist);
    const promisedAlbums = obtainAlbums(artistName);
    promisedAlbums.then((albums) => {
      const artistID = 4;
      for(let i=0; i < albums.length; i++){
        const albumData = {
          name: albums[i],
          year: undefined
          };
        unqfy.addAlbum(artistID, albumData); // cambiar 4 por artistId
      }
      callback(null, unqfy);
    }).catch((err) => {callback(err, null);});
  }
   
  //------------------- SYNCHRONIC METHODS -------------------//

  addArtist(artistData) {  
    if(!this.artistAlreadyExists(artistData.name)){
      const id = this.idGenerator.obtainId('artist'); 
      const myArtist = new Artist(id, artistData.name, artistData.country);
      this.artists[id] = myArtist;
      return myArtist;
    }
  }

  artistAlreadyExists(artistName) {
    for (const artistId in this.artists){
      if((this.artists[artistId].name === artistName)){
        throw new Error(`Artist ${artistName} already exists!`);
      }
    }
    return false;
  }

  deleteArtist(artistId) {
    const myArtist = this.getEntity('artist', artistId);
    for(const albumId in myArtist.albums) {this.deleteAlbum(albumId);}
    delete this.artists[artistId];
  }

  addAlbum(artistId, albumData) {   
    const myArtist = this.getEntity('artist', artistId);
    const albumId = this.idGenerator.obtainId('album');
    const myAlbum = new Album(albumId, albumData.name, albumData.year);
    myArtist.addAlbum(myAlbum,albumId);
    return myAlbum;
  }

  deleteAlbum(albumId) {
    const myAlbum = this.getEntity('album', albumId);
    for(const trackId in myAlbum.tracks){
      this.deleteTrack(trackId);
    }
    for(const artistId in this.artists){
      const myArtist = this.artists[artistId];
      myArtist.deleteAlbumIfExists(myAlbum);
    } 
  }
  
  addTrack(albumId, trackData) {
    const myTrack = new Track(trackData.name, trackData.duration, trackData.genres);
    const myAlbum = this.getAlbumById(albumId);
    const id = this.idGenerator.obtainId('track'); 
    myAlbum.addTrack(id, myTrack);
    return myTrack; 
  }

  deleteTrack(trackId) {
    const myTrack = this.getEntity('track',trackId);
    for (const playlistId in this.playlists){
      const playlist = this.playlists[playlistId];
      playlist.deleteTrackIfExists(myTrack);
      }
    for(const artistId in this.artists){
      const myArtist = this.getEntity('artist', artistId);
      for(const albumId in myArtist.albums){
        const myAlbum = this.getEntity('album', albumId);
        myAlbum.deleteTrackIfExists(myTrack);
      }
    }
  }

  getArtistById(id) {
    const artist = this.artists[id];
    if(artist !== undefined){
          return artist;
    }
    else{
      throw new Error(`Artist with id ${id} does not exist!`);
    }
  }

  getAlbumById(id) {
    for (const artistId in this.artists) {
      const artist = this.artists[artistId];
      const myAlbum = artist.albums[id];
      if(myAlbum !== undefined){
        return myAlbum;
      }
    }
    throw Error(`Album with id ${id} does not exist!`);
  }

  getTrackById(id) {
    for (const artistId in this.artists) {
      const artist = this.artists[artistId];
      for(const albumId in artist.albums){
        const album = artist.albums[albumId];
        const myTrack = album.tracks[id];
        if(myTrack !== undefined){
          return myTrack;
        }
      }
    }
    throw Error(`Track with id ${id} does not exist!`);
  }

  getPlaylistById(id) {
    const playlist = this.playlists[id];
    if (playlist !== undefined){
      return playlist;
    }
    else{
      throw new Error (`Playlist with id ${id} does not exist!`);
    }
  }

  getAllArtists(){
    return this.artists;
  }

  getTracksFromAlbum(albumId){
    const tracks = [];
    const myAlbum = this.getAlbumById(albumId);
    for(const track in myAlbum.tracks){
      const myTrack = myAlbum.tracks[track];
      tracks.push(myTrack); 
    }
    return tracks;
  }

  getAlbumsFromArtist(artistId){
    const albums = [];
    const myArtist = this.getArtistById(artistId);
    for(const album in myArtist.albums){
      const myAlbum = myArtist.albums[album];
      albums.push(myAlbum); 
    }
    return albums;
  }

  getTracksMatchingGenres(genres) {
    let matches = [];
    for (const artistId in this.artists) {
      const artist = this.artists[artistId];
      matches = matches.concat(artist.getTracksMatchingGenres(genres));
    }
    return matches;
  }   

  getTracksMatchingArtist(artistId) {
    const tracks = [];
    const myArtist = this.artists[artistId];
    for (const albumId in myArtist.albums){
      const myAlbum = myArtist.albums[albumId];
      for (const trackId in myAlbum.tracks){
        const myTrack = myAlbum.tracks[trackId];
        tracks.push(myTrack);
      }
    }
    return tracks;
  }

  getArtistByName(artistName){
    for (const artistID in this.artists){
      const myArtist = this.getEntity('artist', artistID);
      if(myArtist.name === artistName){
        return myArtist;
      }
    }
    throw new Error (`Artist with name ${artistName} doesn't exist`);
  }

  searchByName(string) {
    const artistList = [];
    const albumList = [];
    const trackList = [];
    const playlistList = [];
    for (const artistId in this.artists){
      const myArtist = this.artists[artistId];
      this.addToListIfMatches(artistList, myArtist, string);
      for(const albumId in myArtist.albums){
        const myAlbum = myArtist.albums[albumId];
        this.addToListIfMatches(albumList, myAlbum, string);
        for(const trackId in myAlbum.tracks){
          const myTrack = myAlbum.tracks[trackId];
          this.addToListIfMatches(trackList, myTrack, string);
        }
      }
    }
    for (const playlist in this.playlists){
      const myPlaylist = this.playlists[playlist];
      this.addToListIfMatches(playlistList, myPlaylist, string);
    }
      return({
        artists: artistList,
        albums: albumList,
        tracks: trackList,
        playlists: playlistList
      });
    }
  
    addToListIfMatches(results, entity, string) {
      if(entity.name.includes(string)){
        results.push(entity);
      }
    }

  createPlaylist(name, genresToInclude, maxDuration) {
    const id = this.idGenerator.obtainId('playlist');
    const tracksMatchingGenres = this.getTracksMatchingGenres(genresToInclude); 
    const trackList = this.generateRandomTrackList(tracksMatchingGenres, maxDuration);
    const myPlaylist = new Playlist(name, genresToInclude, trackList);
    this.playlists[id] = myPlaylist;
    return myPlaylist;
  }

  generateRandomTrackList(tracks, maxDuration) {
    const alltracks = tracks;
    const trackList = [];
    let duration = 0;
    while(this.existTracksToFitDuration(tracks,(maxDuration-duration)) & alltracks.length !== 0 ){
      const ranIndex = this.randomIndex(alltracks.length);
      const track = alltracks.splice(ranIndex,1).pop();
      if (track.duration <= (maxDuration-duration)){     
         trackList.push(track);
         duration = duration + parseInt(track.duration);
      }    
    }
    return trackList;  
  }

  randomIndex(maxIndex) {
    return Math.floor((Math.random() * maxIndex) );
  }

  existTracksToFitDuration(tracks, durationLeft){
    for(const trackId in tracks){
      const duration = tracks[trackId].duration;
      if(duration !== undefined && (duration <= durationLeft)){
        return true;
      }
    }
    return false;
  }

  getEntity(entity, id){
    if(entity === 'artist'){
      return this.getArtistById(id);
    }
    if(entity === 'album'){
      return this.getAlbumById(id);
    }
    if(entity === 'track'){
      return this.getTrackById(id);
    }
    if(entity === 'playlist'){
      return this.getPlaylistById(id);
    }
  }

  //------------------- SAVE/LOAD -------------------//

  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    const classes = [UNQfy, Artist, IdGenerator, IdIterator, Album, Track, Playlist];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }

  static asyncLoad(filename, callback) {
    const readFilePromise = promisify(fs.readFile);
    const serializedData = readFilePromise(filename, {encoding: 'utf-8'});
    const classes = [UNQfy, Artist, IdGenerator, IdIterator, Album, Track, Playlist];
    serializedData.then((data) => {
      callback(null, picklify.unpicklify(JSON.parse(data), classes));
    }).catch((err) => {callback(err, null);});
  }

  asyncSave(filename, unqfy, callback){
    const listenersBkp = unqfy.listeners;
    unqfy.listeners = [];
    const serializedData = picklify.picklify(unqfy);
    unqfy.listeners = listenersBkp;
    const writeFilePromise = promisify(fs.writeFile);
    const savedFile = writeFilePromise(filename, JSON.stringify(serializedData, null, 2));
    savedFile.then(() => {callback(null, null);})
    .catch((err) => {callback(err, null);});
  }
}

//---------------------------------------------------------//

module.exports = {
  UNQfy,
};