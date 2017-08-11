// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
let colors = ["red", "blue", "green", "orange", "purple", "black"];
var connectionId = 0;
var connectionColors = {};

let randomColor = () =>
{
  return colors[Math.floor((Math.random()*5))];
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.id = connectionId ++;
  connectionColors[ws.id] = randomColor();
  console.log('Client connected', ws.id);

  wss.broadcast = (data) => {
    console.log("Broadcasting...");
    wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(data));
    });
  };
  
  wss.broadcast({type:"incomingCount", count: wss.clients.size});

  ws.on('message', function incoming(data) {
    let message = JSON.parse(data);
    switch(message.type) {
      case "postMessage":
        message.type = "incomingMessage";
        break;
      case "postNotification":
        message.type = "incomingNotification";
        break;
      default:
        break;
      }

    data = Object.assign({}, {id: uuidv1(), color: connectionColors[ws.id]}, message);
    wss.broadcast(data);

  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});
