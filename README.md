# Botmetrics Middleware for Botframework

[Botmetrics](https://www.getbotmetrics.com) is an analytics and
engagement platform for chatbots.


## Installation

Add `botmetrics-botframework-middleware` to your `package.json`

```
$ npm install --save botmetrics-botframework-middleware
```

## Usage (Facebook)

Register your Facebook bot with
[Botmetrics](https://getbotmetrics.com). Once you have done so, navigate to "Bot Settings" and find out your Bot ID and API Key.

Set the following environment variables with the Bot ID and API
Key respectively.

```
BOTMETRICS_BOT_ID=your-bot-id
BOTMETRICS_API_KEY=your-api-key
```

For Messenger bots, require `FacebookMiddleware` and use the middleware in your bot like so:


```javascript
// Initialize the middleware
var FacebookMiddleware = require('botmetrics-botframework-middleware').FacebookMiddleware({
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
    receive: FacebookMiddleware.receive,
    send: FacebookMiddleware.send
  }
);
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/botmetrics/botmetrics.js. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
