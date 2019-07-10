const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

global.monitoring = true;

global.unqfyStatus = false;
global.notifierStatus = false;
global.loggingStatus = false;

app.get('/status', (_req, res) => {
    checkServicesStatus((statuses) => {
        res.status(200).send(statuses);
    });
});

app.post('/monitoring', (req, res) => {
    this.monitoring = req.body.status;
    res.status(200).send({});
});

function monitor(){
    setInterval(() => checkServicesStatus((statuses)=>{
        if(statuses.unqfy !== this.unqfyStatus){
            this.unqfyStatus = statuses.unqfy;
            notifySlack('UNQfy', statuses.unqfy);
        }
        if(statuses.notifier !== this.notifierStatus){
            this.notifierStatus = statuses.notifier;
            notifySlack('Notifier', statuses.notifier);
        }
        if(statuses.logging !== this.loggingStatus){
            this.loggingStatus = statuses.logging;
            notifySlack('Logging', statuses.logging);
        }
    }), 5000);
}

function checkServicesStatus(callback){
    if(this.monitoring){
        checkUnqfyStatus((unqfyStatus) => {
           checkNotifierStatus((notifierStatus) => {
                checkLoggingStatus((loggingStatus) => {
                    const statuses = {
                        unqfy: unqfyStatus,
                        notifier: notifierStatus,
                        logging: loggingStatus
                    };
                    callback(statuses);
                });
           });
        });
    }
}

function checkUnqfyStatus(callback){
    request.get('http://127.0.0.1:5000/status', {json: {}}, (err) => {
        callback(err === null);
    });
}

function checkNotifierStatus(callback){
    request.get('http://127.0.0.1:5001/status', {json: {}}, (err) => {
        callback(err === null);
    });
}

function checkLoggingStatus(callback){
    request.get('http://127.0.0.1:5002/status', {json: {}}, (err) => {
        callback(err === null);
    });
}

function notifySlack(service, isWorking){
    let msg = 'stopped working.';
    if(isWorking){msg = 'is back to normal.';}
    const datetime = new Date();
    const message = `[${datetime}] ${service} service ${msg}`;
    
    console.log(`[${datetime}] ${service} service ${msg}`);
    request.post('https://hooks.slack.com/services/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', {
            json: {
                text: message,
            }
        }, (error) => {if (error) {return console.log(error);}
    });
}

app.listen(5003, () => {
    console.log('Monitor service running on http://localhost:5003');
  });

monitor();