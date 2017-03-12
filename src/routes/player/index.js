const handler = require('./handler');
const Joi = require('joi');

const routes = [
	{
		method:  'POST',
		path:    '/players',
		handler: handler.createPlayer,
		config:  {
			validate: {
				payload: {
					nickname: Joi.string().min(3),
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
