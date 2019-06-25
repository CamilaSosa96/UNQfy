const express = require('express');
const router = express.Router();
const unqmod = require('./UNQfy');

//------------------ ARTISTS ------------------//

router.post('/api/artists', (req, res) => {
    const unqfy = unqmod.UNQfy.load('data.json');
    console.log(req.body.name);
    const artist = unqfy.addArtist({
        name: req.body.name,
        country: req.body.country
    });
    unqfy.save('data.json');
    res.status(201).send(artist);
});

router.get('/api/artists/:id', (req, res) => {
    const unqfy = unqmod.UNQfy.load('data.json');
    const id = req.params.id;
    const artist = unqfy.getArtistById(id);
    res.status(200).send(artist);
});

module.exports = router;