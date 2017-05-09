const handler = require('./handler');
const Joi = require('joi');

const routes = [
	{
		method:  'POST',
		path:    '/login',
		handler: handler.login,
		config:  {
			validate: {
				payload: {
					id:       Joi.string().min(1),
					password: Joi.string().min(1),
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
	name:    'api.login',
	version: '0.0.1',
};
