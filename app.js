var express = require('express');
var app = express();
var path = require('path');
var port = 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//connect to MongoDB
mongoose.connect('mongodb://localhost/testForAuth');

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// serve static files from template
app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);
var nameSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  title: String,
  description: String,
  imgsrc: String,
  City : String,
  State : String,
  Country : String,
  faddress : String,
  
});
var User = mongoose.model("newlist", nameSchema); 
app.post("/addname", (req, res) => {
  var myData = new User(req.body);
  myData.save()
      .then(item => {
        res.sendFile( __dirname + "/templateLogReg/" + "landing.html" );
      })
      .catch(err => {
          res.status(400).send("Unable to save to database");
      });
});

app.get("/list", (req, res) => { 
  User.find({})
     .then(item => {

console.log(item);
        
res.send(item);
     })

     .catch(err => {
         res.status(400).send("Unable to save to database");
     });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
