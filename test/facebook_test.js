var chai = require('chai');
var sinon = require('sinon');
var nock = require('nock');
var Facebook = require('../src/facebook');

chai.use(require('sinon-chai'));
expect = chai.expect;

describe('Facebook without creds', function() {
  context('botId is not present', function(){
    it('should throw an error', function(done) {
      expect(Facebook.bind(null, { appKey: 'app-key' })).to.throw('No bot id or api key specified');
      done()
    })
  });

  context('appKey is not present', function(){
    it('should throw an error', function(done) {
      expect(Facebook.bind(null, { botId: 'bot-id' })).to.throw('No bot id or api key specified');
      done()
    })
  })
})

describe('Facebook with creds', function() {
  it('should not throw an error', function(done) {
    expect(Facebook.bind(null, { botId: 'bot-id', apiKey: 'api-key' })).to.not.throw('No bot id or api key specified');
    done()
  })

})

describe('.receive', function() {
  var facebook,
      message,
      postback,
      statusCode,
      params,
      facebookHookResponse;

  beforeEach(function() {
    facebook = Facebook({
      botId: 'bot-id',
      apiKey: 'api-key'
    });

    message = {
      type: 'message',
      sourceEvent:
       { sender: { id: '1311098608907965' },
         recipient: { id: '268855423495782' },
         timestamp: 1472641403354,
         message:
          { mid: 'mid.1472641403343:681af9635802378a00',
            seq: 954,
            text: 'change name' } },
      attachments: []
    };

    postback = {
      type: 'message',
      sourceEvent:
       { sender: { id: '1311098608907965' },
         recipient: { id: '268855423495782' },
         timestamp: 1472641403354,
         postback:
          { payload: 'payload' } },
      attachments: []
    };

    responseMessage = {
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
    };

    responsePostback = {
      object: 'page',
      entry: [{
        messaging: [{
          type: postback.type,
          sender: postback.sourceEvent.sender,
          recipient: postback.sourceEvent.recipient,
          timestamp: postback.sourceEvent.timestamp,
          postback: {
            payload: postback.sourceEvent.postback.payload
          }
        }]
      }]
    };

    scope = nock('http://localhost:3000', {
      reqheaders: {
        'Authorization': 'api-key',
        'Content-Type': 'application/json'
      }
    })
    .post('/bots/bot-id/events', params)
    .reply(statusCode);
  });

  context('API returns correct status code', function() {
    before(function() {
      statusCode = 202;
    });

    it('should make a call to the Botmetrics API sending a message', function(done) {
      paramsMessage = JSON.stringify({ event: JSON.stringify(responseMessage), format: 'json' })
      facebook.receive(message, function(err) {
        expect(err).to.be.undefined;
        expect(scope.isDone()).to.be.true;
        done();
      });
    });

    it('should make a call to the Botmetrics API sending a postback', function(done) {
      paramsPostback = JSON.stringify({ event: JSON.stringify(responsePostback), format: 'json' })
      facebook.receive(postback, function(err) {
        expect(err).to.be.undefined;
        expect(scope.isDone()).to.be.true;
        done();
      });
    });
  });

  context('API returns incorrect status code', function() {
    before(function() {
      statusCode = 401;
    });

    it('should make a call to the Botmetrics API sending a message', function(done) {
      facebook.receive(message, function(err) {
        expect(err).to.be.present;
        expect(scope.isDone()).to.be.true;
        done();
      });
    });

    it('should make a call to the Botmetrics API sending a postback', function(done) {
      facebook.receive(postback, function(err) {
        expect(err).to.be.present;
        expect(scope.isDone()).to.be.true;
        done();
      });
    });
  });
});

describe('.send', function() {
  var facebook,
      message,
      statusCode,
      params,
      facebookHookResponse;

  beforeEach(function() {
    facebook = Facebook({
      botId: 'bot-id',
      apiKey: 'api-key'
    });

    message = {
      type: 'message',
      address:
        { id: 'mid.1472641403343:681af9635802378a00',
          user: { id: '1311098608907965', name: 'Vlad Shevtsov' },
          bot: { id: '268855423495782', name: 'facebook' },
        },
      text: 'Hi! What is your name?'
    };

    facebookHookResponse = {
      object: 'page',
      entry: [{
        messaging: [{
          type: message.type,
          sender: message.address.bot,
          recipient: message.address.user,
          message: {
            text: message.text,
            mid: message.address.id,
            seq: 'seq',
            is_echo: true
          }
        }]
      }]
    };

    params = JSON.stringify({ event: JSON.stringify(facebookHookResponse), format: 'json' })

    scope = nock('http://localhost:3000', {
      reqheaders: {
        'Authorization': 'api-key',
        'Content-Type': 'application/json'
      }
    })
    .post('/bots/bot-id/events')
    .reply(statusCode);
  });

  context('API returns correct status code', function() {
    before(function() {
      statusCode = 202;
    });

    it('should make a call to the Botmetrics API sending a message', function(done) {
      facebook.send(message, function(err) {
        expect(err).to.be.undefined;
        expect(scope.isDone()).to.be.true;
        done();
      });
    });
  });

  context('API returns incorrect status code', function() {
    before(function() {
      statusCode = 401;
    });

    it('should make a call to the Botmetrics API sending a message', function(done) {
      facebook.send(message, function(err) {
        expect(err).to.be.present;
        expect(scope.isDone()).to.be.true;
        done();
      });
    });
  });
});
