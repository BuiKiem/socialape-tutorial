const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require("express");

admin.initializeApp();
const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

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

exports.api = functions.https.onRequest(app);