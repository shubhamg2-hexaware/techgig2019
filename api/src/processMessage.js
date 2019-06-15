const request = require('request');
require('dotenv').config()
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_TOKEN;
const getResponse = require('./getResponse');

const sendTextMessage = (senderId, res) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: res
        }
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

module.exports = (event) => {
    console.log('------------------Inside processMessage-------------------');
    console.log(JSON.stringify(event));
    const senderId = event.sender.id;
    const res = "hello";
    sendTextMessage(senderId, res);
};
