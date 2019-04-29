const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
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

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

function main() {
  const params = process.argv.slice(2);
  if(params[0] === 'addArtist'){
    addArtist(params[1], params[2]);
  }
  // removeArtist(artistId)
  if(params[0] === 'addAlbum'){
    addAlbum(params[1], params[2], params[3]);
  }
  //removeAlbum(albumId)
  if(params[0] === 'addTrack'){
    addTrack(params[1], params[2], params[3], params[4]);
  }
  //removeTrack
  //getAllArtists
  //getAlbumsFromArtist
  //getTracksFromAlbum
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
  
}

function addArtist(name,country){
  const unqfy = getUNQfy();
  unqfy.addArtist({
    name: name,
    country: country
  });
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

function getTracksMatchingArtist(artistId){
  const unqfy = getUNQfy();
  unqfy.getTracksMatchingArtist(artistId);
}

function search(string){
  const unqfy = getUNQfy();
  unqfy.searchEntity(string);
}

function getTracksMatchingGenres(genresString) {
  const unqfy = getUNQfy();
  unqfy.getTracksMatchingGenres(parseGenresFromString(genresString));
}

function parseGenresFromString(genresString) {
  return genresString.split(' ');
}

function createPlaylist(name, genresToInclude, maxDuration){
  const unqfy = getUNQfy();
  unqfy.createPlaylist(name, genresToInclude, maxDuration);
  saveUNQfy(unqfy);
}
main();
