# Empowered Conversations API With Twilio Integration

```POST to '/'```
### Post to send a message with twilio. Requires `recipientName`, `recipientPhone`, and `userID`. Method is restricted and requires a valid token from login. Sends a message to recipientPhone with Twilio API.

```POST to '/register'```
### Post to register a new user. Requires `firstName`, `lastName`, `username`, `password`, and `phone`.

```POST to '/login'```
### Post to login a registered user. Requires `username`, `password`. Returns a token to acces restricted routes. 

```POST to '/module'```
### Post to module. Requires `userID`, `guest`. Sends message to the initiator of the original message letting them know that the guest has completed the module. 

```PUT to '/users/:id'```
### Put request for an existing user. Accepts `firstName`, `lastName`, `username`, `password`, and `phone` -- none of which are required.

```GET to '/users/:id'```
### Gets a user by id.

```DELETE to '/users/:id'```
### Deletes a user by id.

```GET to '/restricted```
### Test endpoint to validate a token. 





