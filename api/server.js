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
  let { recipientName, recipientPhone, userID} = req.body;
  if( userID && recipientName && recipientPhone){
  client.messages
  .create({
     body: `Dear ${recipientName}, this is the message from Empowered Conversations. Your friend has something they wish to talk to you about. Please look at the following link for information about the topic they'd like to discuss with you. This is your verifcation code: ${userID} When you have read through the materials we will let your friend know you are ready to have a conversation.`,
     from: '+13164444881',
     to: `${recipientPhone}`
   })
  .then(message => console.log(message.sid));
  res.status(200).json({message:"message sent sucessfully"})
}else{
  res.status(400).json({error: 'Please provide a NAME and PHONE NUMBER for both the SENDER and RECIPIENT'})
}})

server.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json({"id":saved.id, "username":saved.username});
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
          message: `Welcome ${user.firstName}!`, token: token, userID:user.id, phone:user.phone
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

server.put('/users/:id', (req, res) =>{
  const {id} = req.params;
  const changes = req.body;

  if(changes.password){
    const hash = bcrypt.hashSync(changes.password, 10); // 2 ^ n
    changes.password = hash;
  }

  changes? Users.update(id, changes) .then(updated =>{
      if(updated){
          res.status(200).json(updated)
      } else{
          res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
  }) .catch(err =>{
      res.status(500).json({ error: "The user information could not be modified." })
  }) : res.status(400).json({ errorMessage: "Please provide name and bio for the user." })

  
})

server.get('/users/:id', (req, res) =>{
  const {id} = req.params;

  Users.findById(id)
  .then(user => {
      if(user){
      res.status(200).json(user)
      } else{
          res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
  })
  .catch(err =>{
      res.status(500).json({ error: "The user information could not be retrieved." })
  })
})

server.get('/restricted',restricted,(req,res) =>{
res.status(200).json({message:"token is valid"})
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