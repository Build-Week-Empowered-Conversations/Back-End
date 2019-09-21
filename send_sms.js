const accountSid = 'AC69406010d41e9c4fddb3b56368458287';
const authToken = 'b44bc9632a7796fd2036d3a496f753b1';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the message from Empowered Conversations',
     from: '+13164444881',
     to: '+13164694365'
   })
  .then(message => console.log(message.sid));