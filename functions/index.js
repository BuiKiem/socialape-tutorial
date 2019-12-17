const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require("express");
const firebase = require("firebase");


const config = firebaseConfig = {
  apiKey: "AIzaSyDYNEPe4jwYvT09TmMbWRW9kAI-nJRcOgs",
  authDomain: "buikiem-socialape.firebaseapp.com",
  databaseURL: "https://buikiem-socialape.firebaseio.com",
  projectId: "buikiem-socialape",
  storageBucket: "buikiem-socialape.appspot.com",
  messagingSenderId: "275571777524",
  appId: "1:275571777524:web:5f16d0b91eb9dfda5563a1",
  measurementId: "G-3M1WR9XW3B"
};

const app = express();
admin.initializeApp();
firebase.initializeApp(config);

app.get("/screams", (request, response) => {
  admin.firestore().collection("screams").orderBy("createdAt", "desc").get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          sreamId: doc.id,
          ...doc.data(),
        });
      });
      return response.json(screams);
    })
    .catch((error) => console.error(error));
});

app.post("/screams", (request, response) => {
  const newScream = {
    body: request.body.body,
    userHandle: request.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  admin.firestore().collection("screams").add(newScream)
    .then(doc => {
      return response.json({message: `Document ${doc.id} created successfully!`});
    })
    .catch(error => {
      console.log(error);
      return response.status(500).json({error: "Something went wrong"});
    });
});

app.post("/signup", (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle,
  }

  //TODO: Validate data

  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => response.status(201).json({message: `User ${data.user.uid} signup successfully!!!`}))
    .catch(error => {
      console.error(error);
      return response.status(500).json({error: error.code});
    });
});

exports.api = functions.https.onRequest(app);