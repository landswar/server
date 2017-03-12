const Joi = require('joi');
const handler = require('./handler');

const routes = [
	{
		method:  'GET',
		path:    '/grounds',
		handler: handler.getGrounds,
	},
	{
		method:  'GET',
		path:    '/grounds/{id}',
		handler: handler.getGround,
		config:  {
			validate: {
				params: {
					id: Joi.number().min(1),
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
	name:    'api.ground',
	version: '0.0.1',
};
