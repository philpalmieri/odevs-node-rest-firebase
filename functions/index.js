// local firebase emulators:start --only firestore,functions,hosting
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const app = express();

//Use Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.send('HERE');
});

app.get('/api/users', async (req, res) => {
  const usersRef = await db.collection('users').get();
  const users = usersRef.docs.map( u => {
    const { email } = u.data();
    return { id: u.id, email }
  });
  res.json(users);
});

app.get('/api/events', async (req, res) => {
  const eventsRef = await db.collection('events').get();
  const events = eventsRef.docs.map( e => {
    const { title, city, rsvps} = e.data();
    return { id: e.id, title, city, rsvps }
  });
  res.json(events);
});

app.get('/api/events/:eventId', async (req, res) => {
  try {
    const eventRef = await db.collection('events').doc(req.params.eventId).get();
    const event = eventRef.data();
    res.json(event);
  } catch (e) {
    res.json(e);
  }

});
app.get('/api/users/:userId', async (req, res) => {
  try {
    const userRef = await db.collection('users').doc(req.params.userId).get();
    const user = userRef.data();
    res.json(user);
  } catch (e) {
    res.json(e);
  }

});

//Posts
app.post('/api/users', async (req, res) => {
  const { email } = req.body;
  const { id }  = await db.collection('users').add({ email });
  res.json({ id });
});

app.post('/api/events', async (req, res) => {
  const { title, city } = req.body;
  const { id }  = await db.collection('events').add({ title, city, rsvps: {} });
  res.json({ id });
});

app.post('/api/events/:eventId/rsvp', async (req, res) => {
  const { eventId } = req.params;
  const { userId, status } = req.body;

  //throw in some validation later...

  //Get the objects, to confirm ok
  const eventRef = await db.collection('events').doc(eventId).get();
  const userRef = await db.collection('users').doc(userId).get();

  //short circuit if either is invalid
  if(!eventRef || !userRef) {
    res.json({ error: "Invalid user/event" });
  }

  //update the rsvp object
  const rsvps = eventRef.data().rsvps;

  const newRsvps = { ...rsvps, [userId]: status };
  const event = await db.doc(`events/${eventId}`).update({ rsvps: newRsvps });
  res.json(event);
});


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.app = functions.https.onRequest(app);
