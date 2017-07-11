const Joi = require('joi');

const handler = require('./handler');

const routes = [
	{
		method:  'GET',
		path:    '/maps',
		handler: handler.getMaps,
		config:  {
			auth: false,
		},
	},
	{
		method:  'GET',
		path:    '/maps/{id}/preview',
		handler: handler.getMapPreview,
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
	name:    'api.map',
	version: '0.0.1',
};
