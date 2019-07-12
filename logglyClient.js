const winston = require('winston');
const {Loggly} = require('winston-loggly-bulk');

module.exports = function sendMessage(level, message){
winston.add(new Loggly({
    token: '7a79014b-4d69-4df5-8357-c9175a9cd5d3',
    subdomain: 'camilasosa',
    tags: ['Winston-NodeJS'],
    json: true
}));
winston.log(level, message);
};