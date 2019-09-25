const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const restricted = require('../auth/auth-middleware');
const Users = require('../database/user-model');

const server = express();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

server.use(helmet());
server.use(express.json());
server.use(cors());





server.get('/', (req, res) => {
  res.send("It's alive!");
});






server.post('/',restricted, (req,res)=>{
  let { senderName, senderPhone, recipientName, recipientPhone, userID} = req.body;
  if(senderName && senderPhone && recipientName && recipientPhone){
  client.messages
  .create({
     body: `Dear ${recipientName}, this is the message from Empowered Conversations. Your friend has something they wish to talk to you about. Please look at the following link for information about the topic they'd like to discuss with you. This is your verifcation code: ${userID} When you have read through the materials you can reach ${senderName} at ${senderPhone}.`,
     from: '+13164444881',
     to: `${recipientPhone}`
   })
  .then(message => console.log(message.sid));
  res.status(200).json({message:"message sent sucessfully"})
}else{
  res.status(400).json({error: 'Please provide a NAME and PHONE NUMBER for both the SENDER and RECIPIENT'})
}})




//register fuction needs a phone number to add the the database so you can look up the phone number by ID
server.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json({"id":saved.id, "username":saved.username, "phone":saved.phone});
    })
    .catch(error => {
      res.status(500).json(error);
    });
});





server.post('/login', (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token =genToken(user)
        res.status(200).json({
          message: `Welcome ${user.username}!`, token: token, userID:user.id, phone:user.phone
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials'});
      }
    })
    .catch(error => {
      res.status(500).json({error:error, message:"Oops there was an error"});
    });
});



server.post('/module', (req,res) =>{
  let userID = req.body.userID
  let guest = req.body.guest;
  Users.findById(userID)
  .first()
  .then(user =>{
    client.messages
    .create({
       body: `${guest} has completed the informational module you requested them to read. They are ready to listen`,
       from: '+13164444881',
       to: `${user.phone}`
     })
    res.status(200).json({message:"The message has been sent sucessfully"})
  }) 
})



server.get('/restricted',restricted,(req,res)=>{
  res.status(200).json({message:'this is the restricted page'})
})



function genToken(user){
  const payload ={
    subject: user.id,
    username: user.username
  };
  const secret = "super secret";
  const opttions={
    expiresIn: '8h',
  }
  return token = jwt.sign(payload, secret, opttions)
}

module.exports = server;