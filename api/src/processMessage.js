const request = require('request');
require('dotenv').config()
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_TOKEN;
const getResponse = require('./getResponse');
const responseTemplate = require('./responseTemplate');

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
    if (event.message.text == 'simple_text') {
        sendTextMessage(senderId, responseTemplate.simpleText());
    }

    if (event.message.text == 'carousel') {
        sendTextMessage(senderId, responseTemplate.getCarousel());
    }

    if (event.message.text == 'card') {
        sendTextMessage(senderId, responseTemplate.getCard());
    }

    if (event.message.text == 'quick_replies') {
        sendTextMessage(senderId, responseTemplate.getQuickReplies());
    }
    
    if (event.message.text == 'button') {
        sendTextMessage(senderId, responseTemplate.getButton());
    }
};
