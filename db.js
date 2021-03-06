var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
	console.log(process.env.DATABASE_URL);
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	})
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname +'/data/dev-todo-api.sqlite'
	}); 
}

var db = {}

db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.article = sequelize.import(__dirname + '/models/article.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;