const handler = require('./handler');
const Joi = require('joi');

const routes = [
	{
		method:  'POST',
		path:    '/players',
		handler: handler.createPlayer,
		config:  {
			auth:     false,
			validate: {
				payload: {
					email:    Joi.string().email().required(),
					nickname: Joi.string().min(3).required(),
					password: Joi.string().min(3).required(),
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
				params: {
					id: Joi.number(),
				},
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
		config:  {
			validate: {
				params: {
					id: Joi.number(),
				},
			},
		},
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
		config:  {
			validate: {
				params: {
					id: Joi.number(),
				},
			},
		},
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
