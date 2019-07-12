/* eslint-disable no-undef */
const picklify = require('picklify');
const fs = require('fs');
const Subscription = require('./Subscription');

class SubscriptionsAdmin {

    constructor(){
        this.subscriptions = [];
    }

    subscribe(artistId, email){
        const mySub = new Subscription(artistId, email);
        if(!this.subscriptions.some(elem => elem.id === artistId && elem.email === email)){
            this.subscriptions.push(mySub);
        } 
    }

    unsubscribe(artistId, email){
        const sub = this.subscriptions.find((elem) => elem.id === artistId && elem.email === email);
        if(sub !== undefined){
            const index = this.subscriptions.indexOf(sub);
            this.subscriptions.splice(index, 1);
        }
    }

    getSubscribersForArtist(artistId){
        const artistSubs = this.subscriptions.filter((sub) => sub.id === parseInt(artistId));
        const emails = [];
        for(let i = 0; i< artistSubs.length; i++){
            emails.push(artistSubs[i].email);
        }
        return emails;
    }

    deleteSubscriptionsForArtist(artistId){
        this.subscriptions = this.subscriptions.filter((sub) => sub.id !== parseInt(artistId));
    }

    save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    const classes = [SubscriptionsAdmin, Subscription];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

module.exports = SubscriptionsAdmin;