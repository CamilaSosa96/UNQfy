const express = require('express');
const request = require('request');
const router = express.Router();
const bodyParser = require('body-parser');
const subsAdmin = require('./subscriptionsAdmin');
const fs = require('fs');
const sendMail = require('./sendUNQfyMails');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return errorHandler(res, 400, 'BAD_REQUEST');
    }
    next();
  });

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
    if(isInvalidSubscription(req.body)){
        errorHandler(res, 400, 'BAD_REQUEST');
        return;
    } 
    artistExistOnUNQfy(req.body.artistId, (exists) =>{
        if(exists){
            const admin = getSubsAdmin();
            admin.subscribe(req.body.artistId, req.body.email);
            saveSubsAdmin(admin);
            res.status(200).send({});
        } else {
            errorHandler(res, 404, 'RELATED_RESOURCE_NOT_FOUND');
        }
        
    });
});

router.post('/api/unsubscribe', (req, res) => {
    if(isInvalidSubscription(req.body)){
        errorHandler(res, 400, 'BAD_REQUEST');
        return;
    }
    artistExistOnUNQfy(req.body.artistId, (exists) =>{
        if(exists){
            const admin = getSubsAdmin();
            admin.unsubscribe(req.body.artistId, req.body.email);
            saveSubsAdmin(admin);
            res.status(200).send({});
        } else {
            errorHandler(res, 404, 'RELATED_RESOURCE_NOT_FOUND');
        }
    });
});

router.post('/api/notify', (req, res) => {
    const admin = getSubsAdmin();
    const emails = admin.getSubscribersForArtist(req.body.artistId);
    for(const address in emails){
        sendMail(address, req.body);
    }
    res.status(200).send({});
});

router.get('/api/subscriptions', (req, res) => {
    artistExistOnUNQfy(req.query.artistId, (exists) =>{
        if(exists){
            const admin = getSubsAdmin();
            const subs = admin.getSubscribersForArtist(req.query.artistId);
            const response = {
                artistId: req.query.artistId,
                subscriptors: subs
            };
            res.status(200).send(response);
        } else {
            errorHandler(res, 404, 'RELATED_RESOURCE_NOT_FOUND');
        }
    });
});

router.delete('/api/subscriptions', (req, res) =>{
    artistExistOnUNQfy(req.body.artistId, (exists) =>{
        if(exists){
            const admin = getSubsAdmin();
            admin.deleteSubscriptionsForArtist(req.body.artistId);
            saveSubsAdmin(admin);
            res.status(200).send({});
        } else {
            errorHandler(res, 404, 'RELATED_RESOURCE_NOT_FOUND');
        }
    });
});

router.get('*', (_req, res) => {
    errorHandler(res, 404, 'RESOURCE_NOT_FOUND');
  });

//--------------------- AUX METHODS ---------------------//

function artistExistOnUNQfy(artistId, callback){
    const id = parseInt(artistId);
    request.get(`http://127.0.0.1:5000/api/artists/${id}`, {json: {}}, (_err, res) => {
        callback(res.statusCode === 200);
    });
}

function isInvalidSubscription(body){
    return body.artistId === undefined || body.email === undefined;
}

function errorHandler(res, code, message) {
    res.status(code).send({
      status: code,
      errorCode: message 
    });
  }

module.exports = router;