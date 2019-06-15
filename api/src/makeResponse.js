module.exports = {
    "genericResponse": function(callback) {
        var response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Welcome to Service Desk Assistant.",
                            "image_url": "https://s3.envato.com/files/105583135/customer-outline-22590.jpg",
                            "subtitle": "We have the solution of all your queries. Please login to continue",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Incident Request",
                                    "payload": "initialize_incident_request"
                                },
                                {
                                    "type": "postback",
                                    "title": "Service Request",
                                    "payload": "initialize_service_request"
                                }
                            ]
                        }
                    ]
                }
            }
        }
        callback(response);
    },
    "loginResponse": function(senderId, callback) {
        var response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Welcome to Service Desk Assistant.",
                            "image_url": "https://previews.123rf.com/images/lembergvector/lembergvector1511/lembergvector151100034/47770592-time-24-customer-support-center-operator-service-icons-concept-vector-illustration-on-white-backgrou.jpg",
                            "subtitle": "We have the solution of all your queries. Please login to continue",
                            "buttons":[
                                {  
                                    "type":"web_url",
                                    "url":"https://servicenow2.herokuapp.com/webhook/close?psid=" + senderId,
                                    "title":"Login",
                                    "webview_height_ratio":"tall"
                                }
                            ]
                        }
                    ]
                }
            }
        }
        callback(response);
    },
    "getCardResponse": function(id, desc, sysId, callback) {
        var response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": `ID: ${id}`,
                            "subtitle": `Description: ${desc}`,
                            "buttons": [
                                {
                                   "type":"web_url",
                                    "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                    "title":"View",
                                    "webview_height_ratio":"tall"                                    
                                }
                            ]
                        }
                    ]
                }
            }
        }
        callback(response);
    },
    "getCorousalResponse": function(arr, callback) {
        var response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": arr
                }
            }
        }
        callback(response);
    },
    "getQuickReplyResponse": function(callback) {
        var response = {
            "text": "Is there anything else I can help you with.",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Get Latest",
                    "payload": "show_latest_incident"
                },
                {
                    "content_type": "text",
                    "title": "Get By Id",
                    "payload": "view_incident_by_number"
                },
                {
                    "content_type": "text",
                    "title": "Create Incident",
                    "payload": "create_new_incident_request"
                },
                {
                    "content_type": "text",
                    "title": "Thank You",
                    "payload": "thank_you_intent"
                }
            ]
        }
        callback(response);
    },
    "getDfResponse" : function (request, callback) {
        request.result.fulfillment.messages.forEach(function(element) {
            if (element.type == 4) {
                var res = element.payload.facebook;
                callback(null, res);
            }
        })
    },
    "makeApprovalResponse": function(approval, sysId, id, callback) {
        var arr = [];
        arr.push({
            "title": `Requests Number: ${id}`,
            "subtitle": `Approval: ${approval}`,
            "buttons":[
                {  
                    "type":"web_url",
                    "url":`https://dev27552.service-now.com/nav_to.do?uri=/sc_request.do?sys_id=${sysId}`,
                    "title":"View",
                    "webview_height_ratio":"tall"
                }
            ]
        });
        makeFBResponse.getCorousalResponse(arr, function (res) {
            callback(null, res);
        })
    }
}