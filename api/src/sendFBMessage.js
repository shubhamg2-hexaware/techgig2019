var request = require('request');
const FACEBOOK_ACCESS_TOKEN = 'EAAc6hI7VvPwBAHboQmC66s33wksVxCsAjOZAr5scCnsEFc0P2IrFrOvEO9jip3rjoZBo0PDzTckZAWVPwOZC9POI8GldBEALmpP6q8NTeU4ZA0XIp7ZB96gj0rqcSfYR3HQ6Ue3oTmBUNA6Q6lhELpNmtZAj3ttn23lIXh16kTeqQZDZD';

module.exports = {
    "sendResponse": function (psid, response, callback) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: {
            recipient: { id: psid },
            message: {"text": response}
            }
            }, (err, res, body) => {
            if (!err) {
            console.log('message sent!');
            callback(null, body);
            } else {
            console.error("Unable to send message:" + err);
            }
        });
    },
    "sendTemplate": function(psid, res, callback) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: psid },
                message: res
            }
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
                callback(null, body);
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    }
}