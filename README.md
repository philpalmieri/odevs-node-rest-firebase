# Demo Firebase Node and Express REST Api

This is a proof of concept example for running express in firebase functions, with firestore - DO NOT USE THIS FOR PRODUCTION

There is no validation or testing, it is purely to show a proof of concept.

## Installation

- make sure you have the fb cli
- run locally with: firebase emulators:start --only firestore,functions,hosting

## Usage

- Setup a FB account, then you can deploy with firebase deploy... but.. DON'T - this is hacked together code only to show how it works... really, don't use this.


## API Docs (if you can call it that)

GET
- /api/users
- /api/users/:userId
- /api/events
- /api/events/:eventId

POST
- /api/users (email=foo@bar)
- /api/events (title=something&city=somewhere)
- /api/events/:eventId/rsvps (userId=userId&status=anythingyouwant)
