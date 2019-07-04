const request = require('request');

class NotifierObserver{

    notifyAlbum(artistId, artistName, albumName){
        
        request.post('http://127.0.0.1:5001/api/notify', {
            json: {
                artistId: artistId,
                subject: `New album for artist ${artistName}`,
                message: `Artist ${artistName} has released a new album: ${albumName}`,
                from: 'UNQfy <UNQfy.notifications@gmail.com>'
            }
        }, (error) => {
            if (error) {return console.log(error);}
        });
    }

}

module.exports = NotifierObserver;