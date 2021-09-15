const { Router } = require('express');

module.exports.Router = class Home extends Router {
	constructor() {
		super();
		this.get('/', function(req, res) {
			res.status(200).render('home.ejs', {
				bot: global["client"].user,
				database: global["database"].db,
				user: req.user,
				is_logged: Boolean(req.session.user),
				guilds: req.user && req.user.guilds ? req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591) : [],
			});
		});
	}
};

module.exports.name = '/home';