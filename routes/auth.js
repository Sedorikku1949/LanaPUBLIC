const { Router } = require('express');
const CheckAuth = require('../middlewares/CheckAuth');
const btoa = require('btoa');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports.Router = class Auth extends Router {
	constructor() {
		super();
		this.get('/login', async (req, res) => {
			if(req.query.code){
				/* Obtain token - used to fetch user guilds and user informations */
				const params = new URLSearchParams();
				params.set('grant_type', 'authorization_code');
				params.set('code', req.query.code);
				params.set('redirect_uri', req.config.callbackURL);
				let response = await fetch('https://discord.com/api/oauth2/token', {
					method: 'POST',
					body: params.toString(),
					headers: {
						Authorization: `Basic ${btoa(`${global["client"]?.user?.id ?? req.config}:${req.config.bot.secret}`)}`,
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
				// Fetch tokens (used to fetch user informations)
				const tokens = await response.json();
				// If the code isn't valid
				if(tokens.error || !tokens.access_token) return res.redirect('/auth/login');
				const userData = {
					infos: null,
					guilds: null
				};
				while(!userData.infos || !userData.guilds){
					/* User infos */
					if(!userData.infos){
						response = await fetch('http://discordapp.com/api/users/@me', {
							method: 'GET',
							headers: { Authorization: `Bearer ${tokens.access_token}` }
						});
						const json = await response.json();
						if(json.retry_after) await delay(json.retry_after);
						else userData.infos = json;
					}
					/* User guilds */
					if(!userData.guilds){
						response = await fetch('https://discordapp.com/api/users/@me/guilds', {
							method: 'GET',
							headers: { Authorization: `Bearer ${tokens.access_token}` }
						});
						const json = await response.json();
						if(json.retry_after) await delay(json.retry_after);
						else userData.guilds = json;
					}
				}
				// Update session
				req.session.user = Object.assign(userData.infos, {
					guilds: Object.values(userData.guilds)
				});
				res.status(200).redirect('/profile');
			} else {
				res.redirect(`https://discord.com/api/oauth2/authorize?client_id=806438484159102996&permissions=0&response_type=code&scope=guilds%20bot%20applications.commands%20identify`);
			}
		});
		this.get('/logout', [CheckAuth], function(req, res) {
			req.session.destroy();
			res.status(200).redirect('/home');
		});
	}
};

module.exports.name = '/auth';
