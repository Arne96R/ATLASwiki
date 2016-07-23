var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js');
var _ = require('underscore');
var middleware = require('./middleware.js')(db);
var cookieParser = require('cookie-parser');

var app = express();
var PORT = process.env.PORT || 3000;

var currentUsers = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.clearCookie('tauthk').clearCookie('u').sendFile(__dirname + '/public/index.html');
});

app.get('/browse', function (req, res) {
	res.sendFile(__dirname + '/public/browse.html');
});

app.get('/browse/reqArticleTitles', function (req, res) {
	// db.article.findAll({where: {category: 'PersonalPursuit'}}).then(function (pps) {
	// 	console.log(pps);
	// });
	var category=req.query.category;
	console.log(category);
	db.article.findCategory(category).then(function (articleTitles) {
		// var ppTitles = [];
		// pps.forEach(function (pp){
		// 	ppTitles.push(pp.title);
		// });
		articleTitles.unshift(category);
		console.log(articleTitles);
		res.send(articleTitles);
	});
});

app.get('/browse/article/content', function (req, res) {
	var title = req.query.title;
	var category = req.query.category;
	db.article.findTitle(title, category).then(function (articles) {
		res.send(articles);
	});
});

app.get('/search' , function (req, res) {
	res.sendFile(__dirname + '/public/search.html');
});

app.get('/search/results', function (req, res) {
	var search = req.query.searchParams;
	db.article.search(search).then(function (results) {
		res.send(results);
	});
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
	res.clearCookie('tauthk').clearCookie('u');
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
		res.cookie('tauthk', tokenInstance.get('token'), {maxAge:7200000}).cookie('u', userInstance.studentnr, {maxAge: 7200000}).sendFile(__dirname + '/public/post.html');
	}).catch(function () {
		res.status(401).sendFile(__dirname + '/public/loginFail.html');
	});
});

app.post('/post/submit', middleware.requireAuthentication, function (req, res) {
	console.log('article received');
	console.log(req.body);
	db.article.create(req.body);
	res.sendFile(__dirname + '/public/submit.html');

})


db.sequelize.sync().then(function() {
	app.listen(PORT, function () {
	console.log('server running on port: ' + PORT);
	db.user.create({studentnr: 'admin', password: 'admin123'});
	});	
});


