const handler = require('./handler');
const Joi = require('joi');

const routes = [
	{
		method:  'POST',
		path:    '/login',
		handler: handler.login,
		config:  {
			auth: false,
			validate: {
				payload: {
					id:       Joi.string().min(1),
					password: Joi.string().min(1),
				},
			},
		},
	},
	{
		method:  'POST',
		path:    '/checkToken',
		handler: handler.checkToken,
		config:  {
			auth: false,
			validate: {
				payload: {
					token:       Joi.string().min(10),
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
