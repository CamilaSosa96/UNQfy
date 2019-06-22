const fs = require('fs');
const unqmod = require('./unqfy');

//------------------- LOAD/SAVE UNQFY -------------------//

function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

//------------------- MAIN -------------------//

function main() {
  const params = process.argv.slice(2);
  if(params[0] === 'addArtist'){
    addArtist(params[1], params[2]);
  }
  if(params[0] === 'removeArtist'){
    removeArtist(params[1]);
  }
  if(params[0] === 'addAlbum'){
    addAlbum(params[1], params[2], params[3]);
  }
  if(params[0] === 'removeAlbum'){
    removeAlbum(params[1]);
  }
  if(params[0] === 'addTrack'){
    addTrack(params[1], params[2], params[3], params[4]);
  }
  if(params[0] === 'removeTrack'){
    removeTrack(params[1]);
  }
  if(params[0] === 'getAllArtists'){
    getAllArtists();
  }
  if(params[0] === 'getAlbumsFromArtist'){
    getAlbumsFromArtist(params[1]);
  }
  if(params[0] === 'getTracksFromAlbum'){
    getTracksFromAlbum(params[1]);
  }
  if(params[0] === 'getTracksMatchingArtist'){
    getTracksMatchingArtist(params[1]);
  }
  if(params[0] === 'search'){
    search(params[1]);
  }
  if(params[0] === 'getTracksMatchingGenres'){
    getTracksMatchingGenres(params[1]);
  }
  if(params[0] === 'createPlaylist'){
    createPlaylist(params[1], params[2], params[3]);
  }
  if(params[0] === 'getArtistByName'){
    getArtistByName(params[1]);
  }
  if(params[0] === 'show'){
    show(params[1], params[2]);
  }
}

//------------------- SYNCHRONIC METHODS -------------------//

function addArtist(name,country){
  const unqfy = getUNQfy();
  unqfy.addArtist({
    name: name,
    country: country
  });
  saveUNQfy(unqfy);
}

function removeArtist(artistId){
  const unqfy = getUNQfy();
  unqfy.deleteArtist(artistId);
  saveUNQfy(unqfy);
}

function addAlbum(artistId, name, year){
  const unqfy = getUNQfy();
  const albumData = {
    name: name,
    year: year
    };
  unqfy.addAlbum(artistId, albumData);
  saveUNQfy(unqfy);
}

function removeAlbum(albumId){
  const unqfy = getUNQfy();
  unqfy.deleteAlbum(albumId);
  saveUNQfy(unqfy);
}

function addTrack(albumId, name, duration, genresString){
  const unqfy = getUNQfy();
  const trackData = {
    name: name,
    duration: duration,
    genres: parseGenresFromString(genresString),
  };
  unqfy.addTrack(albumId, trackData);
  saveUNQfy(unqfy);
}

function removeTrack(trackId){
  const unqfy = getUNQfy();
  unqfy.deleteTrack(trackId);
  saveUNQfy(unqfy);
}

function getAllArtists(){
  const unqfy = getUNQfy();
  const allArtist = unqfy.getAllArtists();
  console.log(`Results:
    ${printMatches(allArtist)}`);
}

function getAlbumsFromArtist(id){
  const unqfy = getUNQfy();
  const albums = unqfy.getAlbumsFromArtist(id);
  console.log(`Results:
    ${printMatches(albums)}`);
}

function getTracksFromAlbum(id){
  const unqfy = getUNQfy();
  const tracks = unqfy.getTracksFromAlbum(id);
  console.log(`Results:
    ${printMatches(tracks)}`);
}

function getTracksMatchingArtist(artistId){
  const unqfy = getUNQfy();
  const tracks = unqfy.getTracksMatchingArtist(artistId);
  console.log(`Results:
    ${printMatches(tracks)}`);
}

function search(string){
  const unqfy = getUNQfy();
  const results = unqfy.searchByName(string);
  console.log(`Results:
   ${printResults([results.artists,results.albums,results.tracks,results.playlists])}`);
}

function getTracksMatchingGenres(genresString) {
  const unqfy = getUNQfy();
  const tracks = unqfy.getTracksMatchingGenres(parseGenresFromString(genresString));
  console.log(`Results:
    ${printMatches(tracks)}`);
}

function parseGenresFromString(genresString) {
  return genresString.split(' ');
}

function createPlaylist(name, genresToInclude, maxDuration){
  const unqfy = getUNQfy();
  const genres = parseGenresFromString(genresToInclude);
  unqfy.createPlaylist(name, genres, maxDuration);
  saveUNQfy(unqfy);
}

function getArtistByName(artistName){
  const unqfy = getUNQfy();
  try {
    const artist = unqfy.getArtistByName(artistName);
    console.log(artist.printInfo());
  } catch (exception){
    console.log('INVALID ARTIST: ' + exception.message);
  }
}

function show(entity, id){
  const unqfy = getUNQfy();
  const myEntity = unqfy.getEntity(entity, id);
  console.log(`Results:
    ${myEntity.printInfo()}`);
}

//------------------- AUXILIAR FUNCTIONS FOR PRINTING -------------------//

function printMatches(matches){
  let printedResults = '';
  for (const match in matches){
    const myMatch = matches[match];
    printedResults = printedResults + myMatch.printInfo();
  }
  return printedResults;
}

function printResults(results){
  let printedResults = ' ';
  for (const entityType in results){
    const myEntityList = results[entityType];
    for(const entity in myEntityList){ 
    const myEntity = myEntityList[entity];
    printedResults = printedResults + myEntity.printInfo();
    }
  }
  return printedResults;
}

//---------------------------------------------------------//

main();
