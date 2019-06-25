const fs = require('fs');
const express = require('express');
const router = express.Router();
const unqmod = require('./UNQfy');

//------------------ LOAD/SAVE ------------------//

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

//------------------ ARTISTS ------------------//

router.post('/api/artists', (req, res) => {
    const unqfy = getUNQfy();
    const artist = unqfy.addArtist({
        name: req.body.name,
        country: req.body.country
    });
    saveUNQfy(unqfy);
    res.status(201).send(artist);
});

router.get('/api/artists/:id', (req, res) => {
    const unqfy = getUNQfy();
    const artist = unqfy.getArtistById(req.params.id);
    res.status(200).send(artist);
});

router.put('/api/artists/:id', (req, res) => {
    const unqfy = getUNQfy();
    const artist = unqfy.getArtistById(req.params.id);
    artist.updateInfo(req.body.name, req.body.country);
    saveUNQfy(unqfy);
    res.status(200).send(artist);
});

router.delete('/api/artists/:id', (req, res) => {
  const unqfy = getUNQfy();
  unqfy.deleteArtist(req.params.id);
  saveUNQfy(unqfy);
  res.status(204);
});

module.exports = router;