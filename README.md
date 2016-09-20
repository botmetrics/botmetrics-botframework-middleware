##Bot preview
![](http://i.imgur.com/hdERPoh.gif)
#Updated
https://www.wevideo.com/view/738147820
##Example bot. Getting Started
1. Create a Microsoft account if you don't have one. You can do it here: https://signup.live.com/signup
2. Go here: https://dev.botframework.com/ and sign in with your credentials.
3. Register your bot following this instructions: https://docs.botframework.com/en-us/csharp/builder/sdkreference/gettingstarted.html#registering
4. Add `Facebook messenger` `channel` to channels list on the `My Bots` tab.
5. Complete the channel setup ![alt tag](https://docs.botframework.com/en-us/images/connector/connector_channel_config_facebook.png)
6. Put your `Microsoft app_id` and `Microsoft app_password` in `.env` file
   under `MICROSOFT_APP_ID` and `MICROSOFT_APP_PASSWORD` keys.
7. Run ```node example.js```, you can specify different port
   if needed```port=3001 node example.js```.
8. Run 'Ngrok' tunnel with subdomain you've set when registered your bot(`Messaging endpoint`).
9. Try to push `Test` button on this page: https://dev.botframework.com/bots.
   If everything is ok you'll receive `success` message
