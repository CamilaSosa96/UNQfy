const fs = require('fs');
const express = require('express');
const router = express.Router();
const unqmod = require('./UNQfy');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return errorHandler(res, 400, 'BAD_REQUEST');
  }
  next();
});

//-------------------- LOAD/SAVE --------------------//

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

//--------------------- ARTISTS ---------------------//

router.post('/api/artists', (req, res) => {
    validateArtist(req.body, res);
    const unqfy = getUNQfy();
    try {
        const artist = unqfy.addArtist({
        name: req.body.name,
        country: req.body.country
    });
    saveUNQfy(unqfy);
    res.status(201).send(artist);
    } catch (exception){
      errorHandler(res, 409, 'RESOURCE_ALREADY_EXISTS');
    }
});

router.get('api/artists', (_req, res) => {
  const unqfy = getUNQfy();
  const artists = unqfy.getAllArtists();
  res.status(200).send(artists);
});

router.get('/api/artists', (req, res) => {
  const unqfy = getUNQfy();
  const artists = unqfy.searchByName(req.query.name).artists;
  res.status(200).send(artists);
}); 

router.get('/api/artists/:id', (req, res) => {
    const unqfy = getUNQfy();
    try {
      const artist = unqfy.getArtistById(req.params.id);
      res.status(200).send(artist);
    } catch (exception){
      errorHandler(res, 404, 'RESOURCE_NOT_FOUND');
    }
});

router.put('/api/artists/:id', (req, res) => {
    const unqfy = getUNQfy();
    try {
      const artist = unqfy.getArtistById(req.params.id);
      artist.updateInfo(req.body.name, req.body.country);
      saveUNQfy(unqfy);
      res.status(200).send(artist);
    } catch (exception){
      errorHandler(res, 404, 'RESOURCE_NOT_FOUND');
    }
});

router.delete('/api/artists/:id', (req, res) => {
  const unqfy = getUNQfy();
  try {
    unqfy.deleteArtist(req.params.id);
    saveUNQfy(unqfy);
    res.status(204);
  } catch (exception){
    errorHandler(res, 404, 'RESOURCE_NOT_FOUND');
  }
});

//--------------------- ALBUMS ----------------------//

router.post('/api/albums', (req, res) => {
  validateAlbum(req.body, res);
  const unqfy = getUNQfy();
  try{
    const album = unqfy.addAlbum(req.body.artistId,{
      name: req.body.name,
      year: req.body.year
    });
    saveUNQfy(unqfy);
    res.status(201).send(album);
  } catch (exception) {
    if(exception.message.includes('does not exist')){
      errorHandler(res, 404, 'RELATED_RESOURCE_NOT_FOUND');
    } else {
      errorHandler(res, 409, 'RESOURCE_ALREADY_EXISTS');
    }
  }
});

router.get('/api/albums', (_req, res) => {
  const unqfy = getUNQfy();
  const albums = unqfy.getAllAlbums();
  res.status(200).send(albums);
});

router.get('/api/albums', (req, res) => {
  const unqfy = getUNQfy();
  const albums = unqfy.searchByName(req.query.name).albums;
  res.status(200).send(albums);
}); 

router.get('/api/albums/:id', (req, res) => {
  const unqfy = getUNQfy();
  try {
    const album = unqfy.getAlbumById(req.params.id);
    res.status(200).send(album);
  } catch (exception){
    errorHandler(res, 404, 'RESOURCE_NOT_FOUND');
  }
});

router.patch('/api/albums/:id', (req, res) => {
  const unqfy = getUNQfy();
  try {
    const album = unqfy.getAlbumById(req.params.id);
    album.updateYear(req.body.year);
    saveUNQfy(unqfy);
    res.status(200).send(album);
  } catch (exception) {
    errorHandler(res, 404, 'RESOURCE_NOT_FOUND');
  }
});

router.delete('/api/albums/:id', (req, res) => {
  const unqfy = getUNQfy();
  try {
    unqfy.deleteAlbum(req.params.id);
    saveUNQfy(unqfy);
    res.status(204);
  } catch (exception){
    errorHandler(res, 404, 'RESOURCE_NOT_FOUND');
  }
});

//------------------ ERROR HANDLER HELPERS ------------------//

router.post('*', (_req, res) => {
  errorHandler(res, 404, 'RESOURCE_NOT_FOUND');
});

function errorHandler(res, code, message) {
  res.status(code).send({
    status: code,
    errorCode: message 
  });
}

function validateArtist(artistBody, res){
  if(artistBody.name === undefined || artistBody.country === undefined){
    errorHandler(res, 400, 'BAD_REQUEST');
  }
}

function validateAlbum(albumBody, res){
  if(albumBody.artistId === undefined || albumBody.name === undefined || albumBody.year === undefined){
    errorHandler(res, 400, 'BAD_REQUEST');
  }
}

//------------------------------------------------------------//

module.exports = router;