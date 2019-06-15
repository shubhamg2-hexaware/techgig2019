var request = require("request");
 
module.exports = {
    'logIncident' : function(token, desc, callback){
 
        //console.log("The Final Message Utterance to send POST as Query to Service Now");
      var options = { method: 'POST',
        url: 'https://dev27552.service-now.com/api/now/table/incident',
        headers: 
        { 'content-type': 'application/json',
          authorization: `Bearer ${token}` },
        body: 
        { short_description: desc,
          // caller_id: 'Shubham Gupta',
          category:"Laptop",
          urgency: 2,
          comments: 'Chatbot Testing' },
        json: true };
 
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
        // console.log(body);
      });
    },
    'statusIncident' : function(token, ticketnumber, callback){
 
        console.log("The Final Message Utterance to send GET as Query to Service Now");
        var options = { method: 'GET',
          url: 'https://dev27552.service-now.com/api/now/v1/table/incident',
          qs: { number: ticketnumber },
          headers:
           { 'postman-token': '5441f224-d11a-2f78-69cd-51e58e2fbdb6',
             'cache-control': 'no-cache',
             authorization: `Bearer ${token}` } };
 
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
 
          console.log("Success : "+body);
          callback(null, body);
        });
    },
    'deleteIncident': function (id, token, callback) {
        var options = { 
          method: 'DELETE',
          url: `https://dev27552.service-now.com/api/now/table/incident/${id}`,
          headers: {
            'cache-control': 'no-cache',
            authorization: 'Basic YWRtaW46SW5nb2xlc2lyQDE5OTU=' 
          } 
        };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
      });
    },
    'getRecords': function (token, callback) {
      var options = { method: 'GET',
        url: 'https://dev27552.service-now.com/api/now/table/incident',
        headers: { 
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: `Bearer ${token}`
        }
      }
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
      });
    },
    "viewCreatedIncident": function(sysId, token, callback) {
      var options = { 
        method: 'GET',
        url: 'https://dev27552.service-now.com/nav_to.do',
        qs: { uri: `/incident.do?sys_id=${sysId}` },
        headers: { 
          'Cache-Control': 'no-cache',
          authorization: `Bearer ${token}`
        } 
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
      });
    },
    "softwareInstallRequest": function (sysId, token, callback) {
      var options = { method: 'POST',
      url: `https://dev27552.service-now.com/api/sn_sc/v1/servicecatalog/items/${sysId}/add_to_cart`,
      headers: 
      { 'cache-control': 'no-cache',
        'content-type': 'application/json',
        authorization: `Bearer ${token}` },
      body: 
      { sysparm_quantity: 1,
        short_description: 'this was updated with python' },
      json: true };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
      });
    },
    "checkoutRequest": function (token, callback) {
      var options = {
        method: 'POST',
        url: 'https://dev27552.service-now.com/api/sn_sc/servicecatalog/cart/checkout',
        headers: { 
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: `Bearer ${token}` 
        } 
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
      });
    },
    "getCatalogItems": function(callback) {
      var options = { 
        method: 'GET',
        url: 'https://dev27552.service-now.com/api/sn_sc/servicecatalog/items',
        qs: { sysparm_limit: '200' },
        headers: {
          'postman-token': 'ba4a3db1-08a8-e636-51d2-653e19157bd1',
          'cache-control': 'no-cache',
          authorization: 'Basic YWRtaW46SW5nb2xlc2lyQDE5OTU=' 
        } 
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
      });
    },
    "getUserRequests": function(token, callback) {
      var options = { 
        method: 'GET',
        url: 'https://dev27552.service-now.com/sc_request_list.do',
        qs: {
          JSONv2: '',
          sysparm_userpref_module: '17e0b4990a04bf15013f9590408c419a'
        },
        headers: {
          'cache-control': 'no-cache',
          authorization: `Bearer ${token}` 
        } 
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
      });
    },
    "getAllUserRecords": function(callback) {
      var options = {
        method: 'GET',
        url: 'https://dev27552.service-now.com/sc_request_list.do',
        qs: {
          JSONv2: '',
          sysparm_userpref_module: '17e0b4990a04bf15013f9590408c419a'
        },
        headers: {
          'postman-token': '8b7c28f1-a60a-c809-1549-d93a09188a7d',
          'cache-control': 'no-cache',
          authorization: 'Basic YWRtaW46SW5nb2xlc2lyQDE5OTU='
        }
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
      });
    }

}