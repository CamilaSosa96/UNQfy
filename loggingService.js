const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//------------------- LOAD/SAVE LOGS -------------------//

function getLogs(filename = 'logs.txt', callback){
    if(fs.existsSync(filename)){
        fs.readFile(filename, (_err, logs) =>{
             callback(null, logs);
        });
    } else {
        callback(null, '');
    }
}

function saveLogs(logs, filename = 'logs.txt', callback){
    fs.writeFile(filename, logs, (err) => {
        if(err){console.log(err.message);}
        callback(null, null);
    });
}

//------------------------------------------------------/

app.post('/log', (req, res) => {
        getLogs('logs.txt', (err, logs) =>{
            if(err){console.log(err.message);}
            const newLogs = generateLogsFile(logs, req.body.level, req.body.message);
            saveLogs(newLogs, 'logs.txt', (err)=> {
                if(err){console.log(err.message);}
                res.status(200).send({});
            });
        });
});

//----------------- Auxiliar Methods -------------------//

function generateLogsFile(logs, level, message){
const result =
`${logs}
[${level}]: ${message}`;
    return result;
}

//------------------------------------------------------//

app.listen(5002, () => {
  console.log('Logging service running on http://localhost:5002');
});