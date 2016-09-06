var HttpClient = require('scoped-http-client');

module.exports = function(credentials) {
  if (!credentials || !credentials.botId || !credentials.apiKey) {
    throw new Error('No bot id or api key specified');
  }

  var host = process.env.BOTMETRICS_API_HOST || 'https://www.getbotmetrics.com',
      url  = host + "/bots/" + credentials.botId + "/events",
      http = HttpClient.create(url),
      Facebook = {};

  Facebook.receive = function(session, next) {
    var event = JSON.stringify(facebookReceivedEvent(session));
    sendRequest(event, next);
  }

  Facebook.send = function(session, next) {
    var event = JSON.stringify(facebookSendEvent(session));
    sendRequest(event, next);
  }

  function sendRequest(event, next) {
    http.header('Authorization', credentials.apiKey).
         header('Content-Type', 'application/json').
         post(JSON.stringify({event: event, format: 'json'}))(function(err, resp, body) {
           if(err) {
             next(err);
           } else if (resp.statusCode != 202) {
             next(new Error("Unexpected Status Code from Botmetrics API"));
           } else {
             next();
           }
         });
  }

  function facebookReceivedEvent(message) {
    if(!message) {
      return null
    } else {
      return {
        object: 'page',
        entry: [{
          messaging: [{
            type: message.type,
            sender: message.sourceEvent.sender,
            recipient: message.sourceEvent.recipient,
            timestamp: message.sourceEvent.timestamp,
            message: {
              text: message.text,
              mid: message.sourceEvent.message.mid,
              seq: message.sourceEvent.message.seq,
              attachments: message.attachments
            }
          }]
        }]
      }
    }
  }

  function facebookSendEvent(message) {
    if(!message) {
      return null
    } else {
      return {
        object: 'page',
        entry: [{
          messaging: [{
            type: message.type,
            sender: message.address.bot,
            recipient: message.address.user,
            timestamp: new Date().getTime(),
            message: {
              text: message.text,
              mid: message.address.id,
              seq: 'seq',
              is_echo: true
            }
          }]
        }]
      }
    }
  }

  return Facebook
}
