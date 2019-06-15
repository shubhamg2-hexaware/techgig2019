var serviceNow = require('./servicenow');
var sendFBResponse = require('./sendFBMessage');
var makeFBResponse = require('./makeResponse');
var moment = require('moment');
var regExp = RegExp(/(inc|Inc|iNc|InC|inC|iNC|INc)(\d{7}|\d{6})|(req|Req|rEq|ReQ|reQ|rEQ|REq|REQ)(\d{7}|\d{6})/);
var regExp2 = RegExp(/\d{6}|\d{7}|\d+/);

module.exports = {
    "logRequest": function (request, senderId, sysId, callback) {
        if(request.result.parameters.description != "") {
            var desc = request.result.parameters.description
            if(session.length != 0) {
                session.forEach(function(element){
                    if(element.senderId == senderId) {
                        serviceNow.softwareInstallRequest(sysId, element.token, function(err, body) {
                            var reqNumber;
                            if(body.error == undefined) {
                                serviceNow.checkoutRequest(element.token, function(err, body2){
                                    console.log(body2);
                                    body2 = JSON.parse(body2);
                                    reqNumber = body2.result.request_number;
                                    var arr = [];
                                    var response = `Your request has been created.`;
                                    arr.push({
                                        "title": `Request number: ${reqNumber}`,
                                        "subtitle": `Description: ${desc}`,
                                        "buttons":[
                                            {  
                                                "type":"web_url",
                                                "url":`https://dev27552.service-now.com/nav_to.do?uri=/sc_request.do?sys_id=${body2.result.request_id}`,
                                                "title":"View",
                                                "webview_height_ratio":"tall"
                                            }
                                        ]
                                    });
                                    makeFBResponse.getCorousalResponse(arr, function (res) {
                                        sendFBResponse.sendTemplate(senderId, res, function(body) {
                                            makeFBResponse.getDfResponse(request, function(err, res){
                                                callback(null, res);
                                            })
                                        })
                                    })
                                })
                            }
                        })
                    } else {
                        makeFBResponse.loginResponse(senderId, function(res) {
                            callback(null, res);
                        })
                    }
                })
            } else {
                var response = `Please login first to continue.`;
                sendFBResponse.sendResponse(senderId, response, function(err, body) {
                    makeFBResponse.loginResponse(senderId, function(res) {
                        callback(null, res);
                    })
                })
            }
        } else {
            var response = "Please enter the description to create request."
            sendFBResponse.sendResponse(senderId, response, function(err, body){
                console.log("plain FB message sent");
            });
        }
    },
    "showLatest": function (request, senderId, callback) {
        if(session.length != 0) {
            session.forEach(function(element){
                if(element.senderId == senderId) {
                    if (request.result.metadata.intentName == "latest_incident") {
                        serviceNow.getRecords(element.token, function(err, body) {
                            body = JSON.parse(body);
                            var arr = [];
                            var result = body.result[body.result.length-1];
                            var id = result.number;
                            var desc = result.short_description;
                            var sysId = result.sys_id;
                            var dt = moment(new Date(result.opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                            var active = result.active;
                            var category = result.category;
                            category = category.charAt(0).toUpperCase() + category.slice(1);
                            arr.push({
                                "title": `Incident: ${id}`,
                                "subtitle": `Category: ${category} \nDate: ${dt} \nStatus: ${active ? "Not resolved": "Resolved"}`,
                                "buttons":[
                                    {  
                                        "type":"web_url",
                                        "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                        "title":"View",
                                        "webview_height_ratio":"tall"
                                    }
                                ]
                            });
                            this.sendAllResponse(request, arr, senderId, function(err, res){
                                callback(null, res);
                            })

                        })
                    } else {
                        serviceNow.getUserRequests(element.token, function(err,body) {
                            body = JSON.parse(body);
                            var arr = [];
                            var result = body.records[body.records.length-1];
                            var id = result.number;
                            var approval = result.approval;
                            var dt = moment(new Date(result.opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                            var sysId = result.sys_id;
                            arr.push({
                                "title": `Requests Number: ${id}`,
                                "subtitle": `Approval: ${approval} \nDate: ${dt}`,
                                "buttons":[
                                    {  
                                        "type":"web_url",
                                        "url":`https://dev27552.service-now.com/nav_to.do?uri=/sc_request.do?sys_id=${sysId}`,
                                        "title":"View",
                                        "webview_height_ratio":"tall"
                                    }
                                ]
                            });
                            module.exports.sendAllResponse(request, arr, senderId, function(err, res){
                                callback(null, res);
                            })
                        })
                    }
                } else {
                    makeFBResponse.loginResponse(senderId, function(res) {
                        callback(null, res);
                    })
                }
            })
        } else {
            var response = `Please login first to continue.`;
            sendFBResponse.sendResponse(senderId, response, function(err, body) {
                makeFBResponse.loginResponse(senderId, function(res) {
                        callback(null, res);
                })
            })
        }
    },
    "showLastFive": function (request, senderId, callback) {
        if(session.length != 0) {
            session.forEach(function(element){
                if(element.senderId == senderId) {
                    if (request.result.metadata.intentName == "last_five_incidents") {
                        serviceNow.getRecords(element.token, function(err, body) {
                            body = JSON.parse(body);
                            var arr = [];
                            var length = body.result.length;
                            if (length == 0) {
                                 var response = `No Records Exists.`;
                                sendFBResponse.sendResponse(senderId, response, function(err, body) {
                                    makeFBResponse.getDfResponse(request, function(err, res){
                                        callback(null, res);
                                    })
                                })
                            } else if(length <= 5) {
                                body.result.forEach(function(element){
                                    var id = element.number;
                                    var desc = element.short_description;
                                    var sysId = element.sys_id;
                                    var dt = moment(new Date(element.opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                                    var category = element.category;
                                    var active = element.active;
                                    category = category.charAt(0).toUpperCase() + category.slice(1);
                                    arr.push({
                                        "title": `Incident: ${id}`,
                                        "subtitle": `Category: ${category} \nDate: ${dt} \nStatus: ${active ? "Not resolved": "Resolved"}`,
                                        "buttons":[
                                            {  
                                                "type":"web_url",
                                                "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                                "title":"View",
                                                "webview_height_ratio":"tall"
                                            }
                                        ]
                                    });
                                })
                                module.exports.sendAllResponse(request, arr, senderId, function(err, res){
                                    callback(null, res);
                                })
                            } else {
                                for (i = length - 1; i >= length - 5; i--) {
                                    var id = body.result[i].number;
                                    var desc = body.result[i].short_description;
                                    var sysId = body.result[i].sys_id;
                                    var dt = moment(new Date(body.result[i].opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                                    var category = body.result[i].category;
                                    var active = body.result[i].active;
                                    category = category.charAt(0).toUpperCase() + category.slice(1);
                                        arr.push({
                                            "title": `Incident: ${id}`,
                                            "subtitle": `Category: ${category} \nDate: ${dt} \nStatus: ${active ? "Not resolved": "Resolved"}`,
                                            "buttons":[
                                                {  
                                                    "type":"web_url",
                                                    "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                                    "title":"View",
                                                    "webview_height_ratio":"tall"
                                                }
                                            ]
                                        });
                                }
                                module.exports.sendAllResponse(request, arr, senderId, function(err, res){
                                    callback(null, res);
                                })
                            }
                        })
                    } else {
                        serviceNow.getUserRequests(element.token, function(err,body) {
                            body = JSON.parse(body);
                            var arr = [];
                            var length = body.records.length;
                            if (length == 0) {
                                 var response = `No Records Exists.`;
                                sendFBResponse.sendResponse(senderId, response, function(err, body) {
                                    makeFBResponse.getDfResponse(request, function(err, res){
                                        callback(null, res);
                                    })
                                })
                            } else if (length <= 5) {
                                body.records.forEach(function(element){
                                    var id = element.number;
                                    var sysId = element.sys_id;
                                    var dt = moment(new Date(element.opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                                    var approval = element.approval;
                                    arr.push({
                                        "title": `Request Number: ${id}`,
                                        "subtitle": `Approval: ${approval} \nDate: ${dt}`,
                                        "buttons":[
                                            {  
                                                "type":"web_url",
                                                "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                                "title":"View",
                                                "webview_height_ratio":"tall"
                                            }
                                        ]
                                    });
                                })
                                module.exports.sendAllResponse(request, arr, senderId, function(err, res){
                                    callback(null, res);
                                })
                            } else {
                                for (i = length - 1; i >= length - 5; i--) {
                                    var id = body.records[i].number;
                                    var sysId = body.records[i].sys_id;
                                    var dt = moment(new Date(body.records[i].opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                                    var approval = body.records[i].approval;
                                        arr.push({
                                            "title": `Request Number: ${id}`,
                                            "subtitle": `Approval: ${approval} \nDate: ${dt}`,
                                            "buttons":[
                                                {  
                                                    "type":"web_url",
                                                    "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                                    "title":"View",
                                                    "webview_height_ratio":"tall"
                                                }
                                            ]
                                        });
                                }
                                module.exports.sendAllResponse(request, arr, senderId, function(err, res){
                                    callback(null, res);
                                })
                            }
                        })
                    }
                } else {
                    makeFBResponse.loginResponse(senderId, function(res) {
                        callback(null, res);
                    })
                }
            })
        } else {
            var response = `Please login first to continue.`;
            sendFBResponse.sendResponse(senderId, response, function(err, body) {
                makeFBResponse.loginResponse(senderId, function(res) {
                        callback(null, res);
                })
            })
        }
    },
    "getIncidentById": function (request, senderId, callback) {
        var incidentNumber = request.result.parameters.incidentNumber;
        if(incidentNumber != "" && (regExp.test(incidentNumber) || regExp2.test(incidentNumber))) {
            var incNumber = request.result.parameters.incidentNumber;
            if (isNaN(incNumber)) {
                incNumber = "INC" + incNumber.slice(3);
            } else {
                incNumber = "INC" + incNumber; 
            }        
            if(session.length != 0) {
                session.forEach(function(element){
                    if(element.senderId == senderId) {
                        serviceNow.statusIncident(element.token, incNumber, function(err, body) {
                            body = JSON.parse(body);
                            if (body.error != undefined) {
                                var response = `Record doesn't exist or you are not authorized to view status for incident number ${incNumber}.`;
                                sendFBResponse.sendResponse(senderId, response, function(err, body) {
                                    var response;
                                    request.result.fulfillment.messages.forEach(function(element) {
                                        if (element.type == 4){
                                            response = element.payload.facebook;
                                        }
                                    });
                                    callback(null, response);
                                });
                            } else {
                                var arr = [];
                                var result = body.result[0];
                                var id = result.number;
                                var desc = result.short_description;
                                var sysId = result.sys_id;
                                var dt = moment(new Date(result.opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                                var active = result.active;
                                var category = result.category;
                                category = category.charAt(0).toUpperCase() + category.slice(1);
                                arr.push({
                                    "title": `Incident: ${id}`,
                                    "subtitle": `Category: ${category} \nDate: ${dt} \nStatus: ${active ? "Not resolved": "Resolved"}`,
                                    "buttons":[
                                        {  
                                            "type":"web_url",
                                            "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                            "title":"View",
                                            "webview_height_ratio":"tall"
                                        }
                                    ]
                                });
                                makeFBResponse.getCorousalResponse(arr, function (res) {
                                    sendFBResponse.sendTemplate(senderId, res, function(body) {
                                        var response;
                                        request.result.fulfillment.messages.forEach(function(element){
                                            if (element.type == 4){
                                                response = element.payload.facebook;
                                            }
                                        });
                                        callback(null, response);
                                    })
                                })
                            }
                        })
                    } else {
                        makeFBResponse.loginResponse(senderId, function(res) {
                            callback(null, res);
                        })
                    }
                })
            } else {
                var response = `Please login first to continue.`;
                sendFBResponse.sendResponse(senderId, response, function(err, body) {
                    makeFBResponse.loginResponse(senderId, function(res) {
                            callback(null, res);
                    })
                })
            }
        } else {
            response = `Please enter the incident number to view status.`;
            sendFBResponse.sendResponse(senderId, response, function(err, body) {
                console.log(body);
            });
        }
    },
    "getRequestById": function (request, senderId, callback) {
        var requestNumber = request.result.parameters.requestNumber;
        if( requestNumber != "" && (regExp.test(requestNumber) || regExp2.test(requestNumber))) {
            var reqNumber = request.result.parameters.requestNumber;
            if (isNaN(reqNumber)) {
                reqNumber = "REQ" + reqNumber.slice(3);
            } else {
                reqNumber = "REQ" + reqNumber; 
            }
            console.log(reqNumber + "~~~~~~~~~~~~~~~~~~~~");
            if(session.length != 0) {
                session.forEach(function(element){
                    if(element.senderId == senderId) {
                        serviceNow.getUserRequests(element.token, function(err, body) {
                            body = JSON.parse(body);
                            if (body.records.length == 0) {
                                var response = `Record doesn't exist or you are not authorized to view status for incident number ${incNumber}.`;
                                sendFBResponse.sendResponse(senderId, response, function(err, body) {
                                    makeFBResponse.getDfResponse(request, function(err, res){
                                        callback(null, res);
                                    })
                                });
                            } else {
                                var arr = [];
                                body.records.forEach(function(ele) {
                                    if(ele.number == reqNumber) {
                                        var id = ele.number;
                                        var approval = ele.approval;
                                        var dt = moment(new Date(ele.opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                                        var sysId = ele.sys_id;
                                        arr.push({
                                            "title": `Requests Number: ${id}`,
                                            "subtitle": `Approval: ${approval} \nDate: ${dt}`,
                                            "buttons":[
                                                {  
                                                    "type":"web_url",
                                                    "url":`https://dev27552.service-now.com/nav_to.do?uri=/sc_request.do?sys_id=${sysId}`,
                                                    "title":"View",
                                                    "webview_height_ratio":"tall"
                                                }
                                            ]
                                        });
                                        module.exports.sendAllResponse(request, arr, senderId, function(err, res){
                                            callback(null, res);
                                        })
                                    }
                                })
                                if (arr.length == 0) {
                                    var response = `No matching records found for ID: ${requestNumber}`;
                                    sendFBResponse.sendResponse(senderId, response, function(err, body) {
                                        makeFBResponse.getDfResponse(request, function(err, res){
                                            callback(null, res);
                                        })
                                    })        
                                }
                            }
                        })
                    } else {
                        makeFBResponse.loginResponse(senderId, function(res) {
                            callback(null, res);
                        })
                    }
                })
            } else {
                var response = `Please login first to continue.`;
                sendFBResponse.sendResponse(senderId, response, function(err, body) {
                    makeFBResponse.loginResponse(senderId, function(res) {
                            callback(null, res);
                    })
                })
            }
        } else {
            response = `Please enter the request number to view status.`;
            sendFBResponse.sendResponse(senderId, response, function(err, body) {
                console.log(body);
            });
        }
    },
    "sendAllResponse": function(request, arr, senderId, callback) {
        makeFBResponse.getCorousalResponse(arr, function (res) {
            sendFBResponse.sendTemplate(senderId, res, function(body) {
                makeFBResponse.getDfResponse(request, function(err, res){
                    callback(null, res);
                })
            })
        })
    }
}