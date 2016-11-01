# Botmetrics Middleware for Botframework

[Botmetrics](https://www.getbotmetrics.com) is an analytics and
engagement platform for chatbots.

[![Build
Status](https://travis-ci.org/botmetrics/botmetrics-botframework-middleware.svg?branch=master)](https://travis-ci.org/botmetrics/botmetrics-botframework-middleware)

## Installation

Add `botmetrics-botframework-middleware` to your `package.json`

```
$ npm install --save botmetrics-botframework-middleware
```

## Usage

Register your bot with
[Botmetrics](https://getbotmetrics.com). Once you have done so, navigate to "Bot Settings" and find out your Bot ID and API Key.

Set the following environment variables with the Bot ID and API
Key respectively.

```
BOTMETRICS_BOT_ID=your-bot-id
BOTMETRICS_API_KEY=your-api-key
```

Require `botmetrics-botframework-middleware` and use the middleware in your bot like so:

```javascript
// Initialize the middleware
var BotmetricsMiddleware = require('botmetrics-botframework-middleware').BotmetricsMiddleware({
  botId: process.env.BOTMETRICS_BOT_ID,
  apiKey: process.env.BOTMETRICS_API_KEY
});

// Initialize the connector and the bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

// Use the middleware
bot.use(
  {
    receive: BotmetricsMiddleware.receive,
    send: BotmetricsMiddleware.send
  }
);
```

## Setting your API Host (for Self-Hosting)

If you are using your own self-hosted version of Botmetrics, remember to
set the `BOTMETRICS_API_HOST` environment variable to your host (If you
have hosted your Botmetrics instance at
`https://my-botmetrics-instance.herokuapp.com`, set
`BOTMETRICS_API_HOST` to `https://my-botmetrics-instance.herokuapp.com`.

## Examples

To run the example, run the following command:

```
$ PORT=3000 node examples/example.js
```

Make sure you have `ngrok` running which tunnels to port 3000 and make
sure your bot is set up correctly using Bot Framework.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/botmetrics/botmetrics.js. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
