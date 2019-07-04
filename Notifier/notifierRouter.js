const express = require('express');
const request = require('request');
const router = express.Router();
const bodyParser = require('body-parser');
const subsAdmin = require('./SubscriptionsAdmin');
const fs = require('fs');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//-------------------- LOAD/SAVE --------------------//

function getSubsAdmin(filename = 'subs.json') {
    let admin = new subsAdmin();
    if (fs.existsSync(filename)) {
      admin = subsAdmin.load(filename);
    }
    return admin;
  }
  
  function saveSubsAdmin(admin, filename = 'subs.json') {
    admin.save(filename);
  }

//--------------------- ROUTER ---------------------//

router.post('/api/subscribe', (req, res) => {
    if(artistExistOnUNQfy(req.body.artistId)){
        const admin = getSubsAdmin();
        admin.subscribe(req.body.artistId, req.body.email);
        saveSubsAdmin(admin);
        res.status(200).send({});
    }
});

router.post('/api/unsubscribe', (req, res) => {
    if(artistExistOnUNQfy(req.body.artistId)){
        //Si existe el mail, lo desuscribo. si no no hago nada
        res.status(200).send({});
    } 
});

router.post('/api/notify', (req, res) => {
    //Notifico con la info de request.
    res.status(200).send({});
});

router.get('/api/subscriptions', (req, res) => {
    if(artistExistOnUNQfy(req.query.artistId)){
        const suscribers = []; /// retorno los mails suscritos a el
        res.status(200).send(suscribers);
    }
});

router.delete('/api/subscriptions', (req, res) =>{
    if(artistExistOnUNQfy(req.body.artistId)){
         /// borro los suscriptores de artistaId.
        res.status(200).send({});
    }
});

//--------------------- AUX METHODS ---------------------//

function artistExistOnUNQfy(artistId){
    return true;
    //request.get(`http://127.0.0.1:5000/api/artist/${artistId}`, {json: {}}, (err) => {
      //  if (err) {return false;}
        //return true;
    //});
}

module.exports = router;