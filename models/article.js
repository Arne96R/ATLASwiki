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
					var articleTitles = [];
					try {
						if (typeof category === 'string') {
							article.findAll({where: {category: category}}).then(function (articles) {
								articles.forEach(function (article) {
									articleTitles.push(article.title);
								});
								resolve(articleTitles);
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
			findTitle: function (title, category) {
				return new Promise (function (resolve, reject) {
					var articles = [];
					try {
						if (typeof title === 'string' && typeof category === 'string') {
							article.findAll({where: {title: title, category: category}}).then(function (articles) {
								articles.forEach(function (article) {
									articles.push(article);
								});
								resolve(articles);
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
			search: function (searchParams) {
				return new Promise (function (resolve, reject) {
					var results = {};
					results.titles = [];
					results.texts = [];
					results.authors = [];

					try {
						if (typeof searchParams === 'string') {
							article.findAll({where: {title: {$like:'%'+searchParams+'%'}}}).then(function (articles) {
								articles.forEach(function (article) {
									results.titles.push(article);
								});
								article.findAll({where: {text: {$like:'%'+searchParams+'%'}}}).then(function (articles) {
									articles.forEach(function (article) {
										results.texts.push(article);
									});
									article.findAll({where: {author: {$like:'%'+searchParams+'%'}}}).then(function (articles) {
										articles.forEach(function (article) {
											results.authors.push(article);
										});
										resolve(results);

										// should work.. possibly change if not
									}, function (e) {
										reject();
									});
								}, function (e) {
									reject();
								});
							}, function(e) {
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