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
  console.log('a user connected');
  let URL = encodeURIComponent(socket.request.headers.origin).replace(/\./g, '%2E')
  if(URL == 'null'){
    URL = "playground";
  }
  console.log(URL)
  db.ref(URL).once('value',(snap)=>{
    console.log('init-'+URL)
    socket.emit('init-'+URL,snap.val())
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('varChanged', (val) => {
    console.log(val)
    if(Object.keys(val).length>0){
      let prop = Object.keys(val)[0]
      let obj = val[prop]//cleanObj(val[prop])
      console.log(URL+" "+JSON.stringify({[prop]:obj}))
      db.ref(URL).update({
        [prop]:obj
      })
      socket.broadcast.emit('newVal-'+URL, val);
    }
  });
});

function cleanObj(obj){
  if(typeof obj != "object"){
    if(typeof obj == "function")
      obj = obj.toString();
    return obj
  }
  for(let prop of obj)
      obj[prop] = cleanObj(obj[prop])
  return obj
}

http.listen(port, () => {
  console.log('listening on :'+port);
});
  