const handler = require('./handler');
const Joi = require('joi');

const routes = [
	{
		method:  'GET',
		path:    '/units',
		handler: handler.getUnits,
		config:  {
			auth: false,
		},
	},
	{
		method:  'GET',
		path:    '/units/{id}',
		handler: handler.getUnit,
		config:  {
			auth:     false,
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
	name:    'unitPlugin',
	version: '0.0.1',
};
