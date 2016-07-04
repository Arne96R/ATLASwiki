var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js');
var _ = require('underscore');
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;

var currentUsers = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/user', middleware.requireAuthentication, function (req, res) {
	res.sendFile(__dirname + '/public/user.html');
});

app.post('/user', middleware.requireAuthentication, function (req, res) {
	console.log(req.body);
	var body = _.pick(req.body, 'studentnr', 'password');
	db.user.create(body).then(function (user) {
		console.log(user.toJSON());
		res.sendFile(__dirname + '/public/index.html');
	}, function (e)  {
		res.status(400).json(e);
	});
});


app.get('/login', function (req, res) {
	res.sendFile(__dirname + '/public/login.html');
});

app.post('/post', function (req, res) {
	var body = _.pick(req.body, 'studentnr', 'password');
	var userInstance;

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token: token
		});
	}).then(function (tokenInstance) {
		
		res.header('Auth', tokenInstance.get('token')).sendFile(__dirname + '/public/post.html');
	}).catch(function () {
		res.status(401).sendFile(__dirname + '/public/loginFail.html');
	});
});

app.post('/post/submit', middleware.requireAuthentication, function (req, res) {
	console.log('article received')
	console.log(req.body);
	res.sendFile(__dirname + '/public/submit.html');

})


db.sequelize.sync({force:true}).then(function() {
	app.listen(PORT, function () {
	console.log('server running on port: ' + PORT);
	db.user.create({studentnr: 'admin', password: 'admin123'});
	});	
});


