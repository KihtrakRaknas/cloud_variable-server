const express = require('express')
const fetch = require('node-fetch');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//io.origins('*:*')

require('dotenv').config();
var admin = require("firebase-admin");
console.log(process.env.FIREBASE_CONFIG)

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
    databaseURL: "https://cloud-variable.firebaseio.com/"
  });

var db = admin.database();

const port = process.env.PORT || 3000
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

io.on('connection', (socket) => {
  console.log(socket.request.headers)
  console.log(socket.request.url)
  console.log('a user connected');
  let URL = encodeURIComponent(socket.request.headers.origin)
  if(URL == null)
    URL = "playground";
  db.ref(URL).once('value',(snap)=>{
    socket.emit('init',snap.val())
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('varChanged', (val) => {
    let prop = Object.keys(val)[0]
    console.log(URL+" "+{[prop]:val[prop]})
    db.ref(URL).update({
      [prop]:val[prop]
    })
    socket.broadcast.emit('newVal', val);
  });
});

http.listen(port, () => {
  console.log('listening on :'+port);
});
  