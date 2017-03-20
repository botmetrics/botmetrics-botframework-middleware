var HttpClient = require('scoped-http-client');

module.exports = function(credentials) {
  if (!credentials || !credentials.botId || !credentials.apiKey) {
    throw new Error('No bot id or api key specified');
  }

  var host = process.env.BOTMETRICS_API_HOST || 'https://www.getbotmetrics.com',
      url  = host + "/bots/" + credentials.botId + "/events",
      http = HttpClient.create(url),
      BotmetricsMiddleware = {};

  BotmetricsMiddleware.receive = function(session, next) {
    var parsedEvent = facebookReceivedEvent(session);
    if(parsedEvent) {
      var event = JSON.stringify(parsedEvent);
      sendRequest(event, next);
    } else {
      next();
    }
  }

  BotmetricsMiddleware.send = function(session, next) {
    var parsedEvent = facebookSendEvent(session);
    if(parsedEvent) {
      var event = JSON.stringify(parsedEvent);
      sendRequest(event, next);
    } else {
      next();
    }
  }

  function sendRequest(event, next) {
    http.header('Authorization', credentials.apiKey).
         header('Content-Type', 'application/json').
         post(JSON.stringify({event: event, format: 'json'}))(function(err, resp, body) {
           if(err) {
             console.log("error sending botmetrics event", err);
             next(err);
           } else if (resp.statusCode != 202) {
             console.log("error sending botmetrics event, wrong status code", resp.statusCode);
             next(new Error("Unexpected Status Code from Botmetrics API"));
           } else {
             console.log("successfully sent to botmetrics API");
             next();
           }
         });
  }

  function facebookReceivedEvent(message) {
    if(!message) {
      return null
    } else {
      if(message.source == 'facebook') {
        var obj = {
          object: 'page',
          entry: [{
            messaging: [{
              type: message.type,
              sender: message.sourceEvent.sender,
              recipient: message.sourceEvent.recipient,
              timestamp: message.sourceEvent.timestamp
            }]
          }]
        };

        if(message.sourceEvent.postback) {
          obj.entry[0].messaging[0].postback = message.sourceEvent.postback
        } else {
          obj.entry[0].messaging[0][message.type] = {
            text: message.text,
            mid: message.sourceEvent.message.mid,
            seq: message.sourceEvent.message.seq,
            attachments: message.sourceEvent.message.attachments
          }
        }

        return obj;
      } else {
        return null;
      }
    }
  }

  function facebookSendEvent(message) {
    if(!message) {
      return null
    } else {
      if(message.source == 'facebook') {
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
      } else {
        return null;
      }
    }
  }

  return BotmetricsMiddleware;
}
