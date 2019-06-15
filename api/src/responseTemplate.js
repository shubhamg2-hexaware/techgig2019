module.exports = {
    'simpleText': (cb) => {
        return {
            "text": "This is a simple text message"
        }
    },
    'getCard': () => {
        return {
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":[
                     {
                      "title":"Welcome!",
                      "image_url":"https://i.imgur.com/7Xdfsau.png",
                      "subtitle":"We have the right hat for everyone.",
                      "default_action": {
                        "type": "web_url",
                        "url": "https://petersfancybrownhats.com/view?item=103",
                        "webview_height_ratio": "tall",
                      },
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://petersfancybrownhats.com",
                          "title":"View Website"
                        },{
                          "type":"postback",
                          "title":"Start Chatting",
                          "payload":"DEVELOPER_DEFINED_PAYLOAD"
                        }              
                      ]      
                    }
                  ]
                }
            }
        }
    },
    'getCarousel': () => {
        return {
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":[
                     {
                      "title":"Welcome!",
                      "image_url":"https://i.imgur.com/7Xdfsau.png",
                      "subtitle":"We have the right hat for everyone.",
                      "default_action": {
                        "type": "web_url",
                        "url": "https://petersfancybrownhats.com/view?item=103",
                        "webview_height_ratio": "tall",
                      },
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://petersfancybrownhats.com",
                          "title":"View Website"
                        },{
                          "type":"postback",
                          "title":"Start Chatting",
                          "payload":"DEVELOPER_DEFINED_PAYLOAD"
                        }              
                      ]      
                    },
                    {
                        "title":"Welcome!",
                        "image_url":"https://i.imgur.com/7Xdfsau.png",
                        "subtitle":"We have the right hat for everyone.",
                        "default_action": {
                          "type": "web_url",
                          "url": "https://petersfancybrownhats.com/view?item=103",
                          "webview_height_ratio": "tall",
                        },
                        "buttons":[
                          {
                            "type":"web_url",
                            "url":"https://petersfancybrownhats.com",
                            "title":"View Website"
                          },{
                            "type":"postback",
                            "title":"Start Chatting",
                            "payload":"DEVELOPER_DEFINED_PAYLOAD"
                          }              
                        ]      
                      }
                  ]
                }
            }
        }
    },
    'getQuickReplies': () => {
        return {
            "text": "Pick a color:",
            "quick_replies":[
              {
                "content_type":"text",
                "title":"Red",
                "payload":"<POSTBACK_PAYLOAD>",
                "image_url":"http://example.com/img/red.png"
              },{
                "content_type":"text",
                "title":"Green",
                "payload":"<POSTBACK_PAYLOAD>",
                "image_url":"http://example.com/img/green.png"
              }
            ]
          }
    },

    'getButton': () => {
        return {
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Try the URL button!",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://www.google.com",
                    "title":"URL Button",
                    "webview_height_ratio": "compact"
                  }
                ]
              }
            }
          }
    }
}