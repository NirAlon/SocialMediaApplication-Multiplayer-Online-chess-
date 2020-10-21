var admin = require("firebase-admin");

var serviceAccount = require("../faceafeka-71da5-firebase-adminsdk-b04t0-7e2a3ad433.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://faceafeka-71da5.firebaseio.com",
  storageBucket: "faceafeka-71da5.appspot.com",
});



//const admin = require('firebase-admin')



////admin.initializeApp();




const db = admin.firestore();


module.exports = {admin, db}