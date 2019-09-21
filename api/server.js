const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken')

const server = express();
const accountSid = process.env.TWILIO_ACCOUNT_SID ;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

server.use(helmet());
server.use(express.json());
server.use(cors());



server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/', (req,res)=>{
  let { senderName, senderPhone, recipientName, recipientPhone } = req.body;
  if(senderName && senderPhone && recipientName && recipientPhone){
  client.messages
  .create({
     body: `Dear ${recipientName}, this is the message from Empowered Conversations. ${senderName} has something they wish to talk to you about. Please look at the following link for information about the topic they'd like to discuss with you. When you have read through the materials you can reach ${senderName} at ${senderPhone}.`,
     from: '+13164444881',
     to: `${recipientPhone}`
   })
  .then(message => console.log(message.sid));
  res.status(200).json({message:"message sent sucessfully"})
}else{
  res.status(400).json({error: 'Please provide a NAME and PHONE NUMBER for both the SENDER and RECIPIENT'})
}})

module.exports = server;
