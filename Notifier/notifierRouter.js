const express = require('express');
const request = require('request');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//--------------------- ROUTER ---------------------//

router.post('/api/suscribe', (req, res) => {
    if(artistExistOnUNQfy(req.body.artistId)){
        //se suscribe en el servicio de notificaciones, si esta suscrito no hago nada
        res.status(200).send({});
    }
});

router.post('/api/unsuscribe', (req, res) => {
    if(artistExistOnUNQfy(req.body.artistId)){
        //Si existe el mail, lo desuscribo. si no no hago nada
        res.status(200).send({});
    } 
});

router.post('/api/notify', (req, res) => {
    //Notifico con la info de request.
    res.status(200).send({});
});

router.get('/api/suscriptions', (req, res) => {
    if(artistExistOnUNQfy(req.query.artistId)){
        const suscribers = []; /// retorno los mails suscritos a el
        res.status(200).send(suscribers);
    }
});

router.delete('/api/suscriptions', (req, res) =>{
    if(artistExistOnUNQfy(req.body.artistId)){
         /// retorno los mails suscritos a el
        res.status(200).send({});
    }
});

//--------------------- AUX METHODS ---------------------//

function artistExistOnUNQfy(artistId){
    request.get(`http://127.0.0.1:5000/api/artist/${artistId}`, {json: {}}, (err) => {
        if (err) {return false;}
        return true;
    });
}

module.exports = router;