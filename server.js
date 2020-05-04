const express = require('express')
const fetch = require('node-fetch');

const app = express()

var admin = require("firebase-admin");
console.log(process.env.FIREBASE_CONFIG)
/*admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
    databaseURL: "https://big-thonk.firebaseio.com"
  });
var db = admin.database();
var serverData = db.ref("server-data");*/

const port = process.env.PORT || 3000
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



  /*app.get('/update', async (req, res) => {
    req.query.prop
    req.query.newValue
    res.json({done:"done"})
  });*/



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
