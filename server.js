/* server.js
 *
 * The main server dispatcher.
 *
 */

require('dotenv').config();

const {
  CONN_STATUS
} = require('./constants')
const {
  WAITING,
  PAIRING,
  DISCONNECTED
} = CONN_STATUS;

const uuid = require('uuid');

// to connect to the database and instantiate the data models
var db = require('./db/connect');

var server = require("http").createServer(app);

// Authentication
var passport = require('passport');

// Parsing post requests
var bodyParser = require('body-parser');
var multer = require('multer');

// ----------------
// Begin Merged code
// ----------------

/*global console*/
var config = require('getconfig'),
    fs = require('fs'),
    sockets = require('./sockets'),
    port = parseInt(process.env.PORT || config.server.port, 10),
    https = require('https'),
    express = require('express');

// Create an http(s) server instance to that socket.io can listen to
var options = {
    key: fs.readFileSync(config.server.key),
    cert: fs.readFileSync(config.server.cert),
};

var app = express();

var server = https.createServer(options, app).listen(port, function() {
    console.log("Express server listening on port " + port);
});

var io = require("socket.io").listen(server);

// ----------------
// End Merged code
// ----------------


// to use the handlebars templating engine
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


const session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});

const sharedsession = require("express-socket.io-session");

app.use(require('cookie-parser')());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());


io.use(sharedsession(session, {
  autoSave:true
}));

const Matcher = require('./matcher');
let matcher = new Matcher((id, status, partner = null) => {
  switch (status) {
    case WAITING:
      {
        // io.sockets.emit("meta", `${id} is waiting`)
        io.to(id).emit("waiting");
        break;
      }
    case PAIRING:
      {
        // io.sockets.emit("meta", `${id} is pairing to ${partner}`)
        io.to(id).emit("pairing", matcher.getUsername(partner));
        break;
      }
    case DISCONNECTED:
      {
        io.to(id).emit("disconnected", matcher.getUsername(partner))
      }
    default:
      {
        break;
      }
  }
})


sockets(server, io, config);

console.log('signal master is running at: ' + "https://localhost:" + port);

// Require our routes
const mainRoute = require('./routes/main')
app.use('/', mainRoute);
