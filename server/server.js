var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var bcrypt = require('bcrypt-nodejs');

var app = express();
var server = http.Server(app);
var websocket = socketio(server, { pingTimeout: 30000, timeout: 30000 });
server.listen(3000, () => console.log('listening on *:3000'));

var random_name = require('node-random-name');
var models = require('./models');

var clients = {}
var users = {}
var chatId = 1

websocket.on('connection', socket => {
    clients[socket.id] = socket;
    socket.on('userJoined', userId => onUserJoined(userId, socket))
    socket.on('message', message => onMessageReceived(message, socket))
    socket.on('signup', data => onSignup(data, socket))
    socket.on('signin', data => onSignin(data, socket))
});

function onSignup(data, socket){
  const pass = bcrypt.hashSync(data.password)

  const userInfo= {...data, password: pass}

  var user = models.user.create(userInfo).then( user => {
    socket.emit('signupConfirmed', `${user.id}`)
  })
}
function onSignin(data, socket){
  var user = models.user.findOne({ where: {username: data.username} }).then(user => {
    if(user != null && bcrypt.compareSync(data.password, user.password)){
      socket.emit('signinConfirmed', `${user.id}`)
    }else{
      socket.emit('signinConfirmed', -1)
    }
  })
}

function onUserJoined(userId, socket) {
  try {
    users[socket.id] = userId
    _sendExistingMessages(socket)
  } catch(err) {
    console.log(err)
  }
}

function onMessageReceived(message, senderSocket) {
  var userId = users[senderSocket.id]
  if (!userId) return;
  _sendAndSaveMessage(message, senderSocket)
}

function _sendExistingMessages(socket) {
  var messages = models.message.findAll({ where: {chatId} }).then( messages => {
    messages = messages.map(m => ({
        _id: m.id,
        text: m.text,
        createdAt: m.createdAt,
        user: {
          _id: m.user,
          name: 'React Native'
        }
    }))
    socket.emit('message', messages.reverse());
  })
}

function _sendAndSaveMessage(message, socket, fromServer) {
  var m = {
    text: message.text,
    user: message.user._id,
    createdAt: new Date(message.createdAt),
    chatId: chatId
  }
  models.message.create(m).then( message => {
    var emitter = fromServer ? websocket : socket.broadcast;
    emitter.emit('message', [{
      _id: message.id,
      text: m.text,
      createdAt: m.createdAt,
      user: {
        _id: m.user,
        name: 'React Native'
      }
    }])
  })
}

var stdin = process.openStdin();
stdin.addListener('data', function(d) {
  var msg = {
    text: d.toString().trim(),
    createdAt: new Date(),
    user: { _id: 'robot' }
  }
  _sendAndSaveMessage( msg, null, true);
});