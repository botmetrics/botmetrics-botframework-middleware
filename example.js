require('dotenv').config();

if (!process.env.botId) {
  console.log('Error: Specify botId in environment');
  process.exit(1);
}

if (!process.env.apiKey) {
  console.log('Error: Specify apiKey in environment');
  process.exit(1);
}

if (!process.env.MICROSOFT_APP_ID) {
  console.log('Error: Specify MICROSOFT_APP_ID in environment');
  process.exit(1);
}

if (!process.env.MICROSOFT_APP_PASSWORD) {
  console.log('Error: Specify MICROSOFT_APP_PASSWORD in environment');
  process.exit(1);
}

var builder = require('botbuilder');
var restify = require('restify');

//=========================================================
// Loading bormetrics middleware module
//=========================================================

var Facebook = require('./index').Facebook({
  botId: process.env.botId,
  apiKey: process.env.apiKey
});

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3000, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/receive', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

//=========================================================
// Connecting botmetrics middleware to bot
//=========================================================

bot.use(
  {
    receive: Facebook.receive,
    send: Facebook.send
  }
)

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.matches(/weather/, [
    function (session) {
        session.beginDialog('/weather');
    },
    function (session, results) {
        session.send('cool');
    }
]);

intents.matches(/postback/, [
    function (session) {
        session.beginDialog('/postback');
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/weather', [
    function (session) {
        if(session.userData.weather) {
          builder.Prompts.text(session, 'I didn`t get smarter from the last time you asked');
        } else {
          builder.Prompts.text(session, 'Sorry i`m a very stupid now, try to ask later');
        }
    },
    function (session, results) {
        session.userData.weather = true;
        session.endDialog();
    }
]);

bot.dialog('/postback', [
  function (session) {
      var msg = new builder.Message(session)
          .textFormat(builder.TextFormat.xml)
          .attachments([
              new builder.HeroCard(session)
                  .title("Hero Card")
                  .buttons([
                    builder.CardAction.postBack(session, 'button', 'button')
                  ])
          ]);
      session.endDialog(msg);
  }
]);
