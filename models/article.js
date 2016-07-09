module.exports = function (sequelize, DataTypes) {
	var article = sequelize.define('article', {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: ["[a-z]", 'i'],
				notEmpty:true,
				len: [1,32]
			}
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
				//equals: 'PersonalPursuit' || 'Project' || 'SemesterAbroad'
			}
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		text: {
			type: DataTypes.STRING,
			allowNull:false,
			validate: {
				notEmpty: true
			}
		}
	}, {
		hooks: {

		},
		instanceMethods: {
		},
		classMethods: {
			findCategory: function (category) {
				return new Promise(function (resolve, reject) {
					var ppTitles = [];
					try {
						if (typeof category === 'string') {
							article.findAll({where: {category: category}}).then(function (articles) {
								articles.forEach(function (article) {
									ppTitles.push(article.title);
								});
								resolve(ppTitles);
							}, function (e) {
								reject();
							});
						} else {
							reject();
						}
					} catch (e) {
						console.log(e);
						reject();
					}
				})
			},
			findTitle: function (title) {
				return new Promise (function (resolve, reject) {
					var articleTexts = [];
					try {
						if (typeof title === 'string') {
							article.findAll({where: {title: title}}).then(function (articles) {
								articles.forEach(function (article) {
									articleTexts.push(article.text);
								});
								resolve(articleTexts);
							}, function (e) {
								reject();
							});
						} else {
							reject();
						}
					} catch (e) {
						console.log(e);
						reject();
					}
				})
			}
		}
	});
	return article;
};