const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken')

const server = express();
const accountSid = 'AC69406010d41e9c4fddb3b56368458287';
const authToken = 'b44bc9632a7796fd2036d3a496f753b1';
const client = require('twilio')(accountSid, authToken);

server.use(helmet());
server.use(express.json());
server.use(cors());



server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/', (req,res)=>{
  let { senderName, senderPhone, recipientName, recipientPhone } = req.body;

  client.messages
  .create({
     body: `Dear ${recipientName}, this is the message from Empowered Conversations. ${senderName} wants to talk to you.`,
     from: '+13164444881',
     to: `${recipientPhone}`
   })
  .then(message => console.log(message.sid));
  res.status(200).json({message:"message sent sucessfully"})
})

module.exports = server;
