const handler = require('./handler');
// const Joi = require('joi');

const routes = [
	{
		method:  'GET',
		path:    '/friends',
		handler: handler.getFriends,
		config:  {
			auth: false,
		},
	},
];

exports.register = function (server, options, next) {
	server.route(routes);
	next();
};

exports.register.attributes = {
	name:    'api.friend',
	version: '0.0.1',
};