const { Router } = require('express');

module.exports.Router = class Home extends Router {
	constructor() {
		super();
		this.get('/', function(req, res) {
			res.status(200).render('index.ejs', {
				bot: global["client"].user,
				user: req.user,
				is_logged: Boolean(req.session.user)
			});
		});
	}
};

module.exports.name = '/';