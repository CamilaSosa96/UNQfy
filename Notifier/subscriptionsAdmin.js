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
        if(!this.artistExist(artistId)){
            throw new Error(`Artist with id ${artistId} does not exist!`);
        }
        this.subscriptions[artistId].delete(email);
    }

    getSubscribersForArtist(artistId){
        if(!this.artistExist(artistId)){
            throw new Error(`Artist with id ${artistId} does not exist!`);
        }
        return Array.from(this.subscriptions[artistId]);
    }

    deleteSubscriptionsForArtist(artistId){
        if(!this.artistExist(artistId)){
            throw new Error(`Artist with id ${artistId} does not exist!`);
        }
        this.subscriptions[artistId].clear();
    }

    artistExist(artistId){
        return this.subscriptions[artistId] !== undefined;
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