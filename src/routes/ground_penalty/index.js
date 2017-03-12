const Joi = require('joi');
const handler = require('./handler');

const routes = [
	{
		method:  'GET',
		path:    '/groundPenalties',
		handler: handler.getGroundPenalties,
	},
	{
		method:  'GET',
		path:    '/groundPenalties/{idUnit}/{idGround}',
		handler: handler.getGroundPenalty,
		config:  {
			validate: {
				params: {
					idUnit:   Joi.number().min(1),
					idGround: Joi.number().min(1),
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
	name:    'api.groundPenalty',
	version: '0.0.1',
};
