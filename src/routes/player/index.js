const handler = require('./handler');
const Joi = require('joi');

const routes = [
	{
		method:  'POST',
		path:    '/players',
		handler: handler.createPlayer,
		config:  {
			auth: false,
			validate: {
				payload: {
					email:    Joi.string().email(),
					nickname: Joi.string().min(3),
					password: Joi.string().min(3),
				},
			},
		},
	},
	{
		method:  'PUT',
		path:    '/players/{id}',
		handler: handler.updatePlayer,
		config:  {
			validate: {
				payload: {
					email:    Joi.string().email(),
					nickname: Joi.string().min(3),
				},
			},
		},
	},
	{
		method:  'DELETE',
		path:    '/players/{id}',
		handler: handler.deletePlayer,
	},
	{
		method:  'GET',
		path:    '/players',
		handler: handler.getPlayers,
	},
	{
		method:  'GET',
		path:    '/players/{id}',
		handler: handler.getPlayer,
	},
];

exports.register = function (server, options, next) {
	server.route(routes);
	next();
};

exports.register.attributes = {
	name:    'api.player',
	version: '0.0.1',
};
