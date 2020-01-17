
const accountSid = 'AC3c3accf4ef843dfe33b1ac951049e1d6';
const authToken = '92bb28e18dc67c3c08462f770d318a75';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'hello man',
     from: '+12243331856',
     to: '+918439179082'
   })
  .then(message => console.log(message.sid));