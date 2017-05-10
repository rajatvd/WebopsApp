const bodyParser = require('body-parser')
const express = require('express');
const app = express();


app.use(bodyParser.urlencoded({extended: true}));


app.listen(3000, function() {
  	console.log('listening on 3000')
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/index.html")
});

app.get('/register', function(req, res){
	res.sendFile(__dirname + "/register.html")
});

app.post('/register', function(req, res){
	console.log(req.body);
	res.send(req.body);

});