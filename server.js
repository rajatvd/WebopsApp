const bodyParser = require('body-parser')
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient



app.use(bodyParser.urlencoded({extended: true}));


var db

MongoClient.connect('mongodb://shaastraApp:giffmethedata@ds131340.mlab.com:31340/job-app-portal', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
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

	    console.log('saved to database')
	    res.redirect('/')
	})
});