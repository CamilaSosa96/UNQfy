const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./artist');
const Album = require('./album');
const IdGenerator = require('./idGenerator');
const IdIterator = require('./idIterator');
const Track = require('./track');
const Playlist = require('./playlist');

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

  artistAlreadyExists(artistName) {
    for (let i = 0; i< this.artists.length; i++){
      const myArtist = this.artists[i];
      if((myArtist !== undefined) && (this.artists[i].name === artistName)){
        throw new Error(`Artist ${artistName} already exists!`);
      }
    }
    return false;
  }

  deleteArtist(artistId) {
    const tracks = this.getTracksMatchingArtist(artistId);
    for (let i=0; i< tracks.length(); i++){
      const track = tracks[i];
      for (const playlistId in this.playlist) {
        const playlist = this.playlist[playlistId];
        if (playlist.hasTrack(track)){
          playlist.deleteTrack(track);
        }
      }   
    } 
    delete this.artists[artistId];
  }

  addAlbum(artistId, albumData) {
    const myAlbum = new Album(albumData.name, albumData.year);
    const result = this.getArtistById(artistId);
      try{
        if(result !== null){
        const albumId = this.idGenerator.obtainId('album');
        this.artists[artistId].addAlbum(myAlbum,albumId);
        console.log(`Album ${albumData.name} added to Artist with id ${artistId} succesfully!`);
        return myAlbum;
      }
    } catch (exception){ 
      console.log('Invalid artist id: ' + exception.message);
    }  
  }

  deleteAlbum(albumId) {
    const tracks = this.getTracksFromAlbum(albumId);
    for (let i=0; i< tracks.length(); i++){
      const track = tracks[i];
      for (const playlistId in this.playlist) {
        const playlist = this.playlist[playlistId];
        if (playlist.hasTrack(track)){
          playlist.deleteTrack(track);
        }
      }   
    } 
    for (const artistId in this.artists){
      const artist = this.artists[artistId];
      if(artist.hasAlbum(this.getAlbumById(albumId)))
        artist.deleteAlbum(albumId);
    }
  }
  
  addTrack(albumId, trackData) {
    const myTrack = new Track(trackData.name, trackData.duration, trackData.genres);
    try{
      const myAlbum = this.getAlbumById(albumId);
      const id = this.idGenerator.obtainId('track'); 
      myAlbum.addTrack(id, myTrack);
      console.log(` ${trackData.name} created succesfully!`);
      return myTrack;
    } catch (exception){ 
      console.log('Invalid track: ' + exception.message);
    }
  }

  deleteTrack(trackId) {
    const track = this.getTrackById(trackId);
    for (const playlistId in this.playlists){
      const playlist = this.playlists[playlistId];
      playlist.deleteTrack(track);
      }
    for (const artistId in this.artists) {
      this.getAlbumsfromArtist(artistId).forEach(function(album){
        if (album.hasTrack(track)){
          album.deletTrack(trackId);
        }
      })
    }
  }

  getArtistById(id) {
    const artist = this.artists[id];
    if(artist !== undefined){
          return artist;
    }
    else{
      throw new Error(`Artist with id ${id} doesnt exist!`);
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
    throw Error(`El album con Id ${id} no existe`);
  }

  getTrackById(id) {
    console.log('1');
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
    throw Error(`El track con Id ${id} no existe`);
  }

  getPlaylistById(id) {
    const playlist = this.playlist[id];
    if (playlist !== undefined){
      return playlist;
    }
    else{
      throw new Error (`Playlist with Id ${id} doesnt exist!`)
    }
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
    for (const album in myArtist.albums){
      const myAlbum = myArtist.albums[album];
      for (const track in myAlbum.tracks){
        const myTrack = myAlbum.tracks[track];
        tracks.push(myTrack);
      }
    }
    return tracks;
  }

  searchEntity(string) {
    const artistList = [];
    const albumList = [];
    const trackList = [];
    const playlistList = [];
    for (const artist in this.artists){
      const myArtist = this.artists[artist];
      this.addToListIfMatches(artistList, myArtist, string);
      for(const album in myArtist.albums){
        const myAlbum = myArtist.albums[album];
        this.addToListIfMatches(albumList, myAlbum, string);
        for(const track in myAlbum.tracks){
          const myTrack = myAlbum.tracks[track];
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
        playlist: playlistList
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
    const myPlaylist = new Playlist(name, genresToInclude, trackList, maxDuration );
    this.playlists[id] = myPlaylist;
    console.log(` Playlist ${name} created succesfully!`);
    return myPlaylist;
  }

  generateRandomTrackList(tracks, maxDuration) {
    const alltracks = tracks;
    const trackList = [];
    let duration = 0;
    while(duration < maxDuration & alltracks.length !== 0 ){
      const ranIndex = this.randomIndex(alltracks.length);
      const track = alltracks.splice(ranIndex,1).pop();
      if ((duration + track.duration) <= maxDuration){      
         trackList.push(track);
         duration = duration + track.duration;
      }    
    }
    return trackList;  
  }

  randomIndex(maxIndex) {
    return Math.floor((Math.random() * maxIndex) );
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
    const classes = [UNQfy, Artist, IdGenerator, IdIterator, Album, Track, Playlist];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

module.exports = {
  UNQfy,
};

