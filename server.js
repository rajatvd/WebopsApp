const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const MongoClient = require('mongodb').MongoClient

app.use(cookieParser());


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('express-session')({
    secret: 'keyboard cat'
}))
app.use(passport.initialize());
app.use(passport.session());


var db;

MongoClient.connect('mongodb://shaastraApp:giffmethedata@ds131340.mlab.com:31340/job-app-portal', function(err, database){
  if (err) return console.log(err);
  db = database;
  app.listen(3000, function(){
    console.log('listening on 3000')
  });
})

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/index.html")
});

app.get('/register', function(req, res){
	res.sendFile(__dirname + "/register.html")
});

app.post('/register', function(req, res){
	console.log(req.body);
	db.collection('users').save(req.body, function(err, result){
	    if (err) return console.log(err);

	    console.log('saved to database');
	    res.redirect('/');
	})
});

app.post('/login', passport.authenticate('login',{
  successRedirect:"/loginSuccess",
  failureRedirect:"/"
}), function(req, res) {
    console.log(req.user);
    res.json(req.user);
});

app.get('/loginSuccess',function(req, res){
	res.send("SUCCCESSS");
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
	done(null, id);
});


passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    console.log('hi'+username+" "+password)
    // check in mongo if a user with username exists or not
    db.collection('users').findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        console.log(user)
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false);                 
        }
        // User exists but wrong password, log the error 
        if (user.password != password){
          console.log('Invalid Password');
          return done(null, false);
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));