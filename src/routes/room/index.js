const handler = require('./handler');
const Joi = require('joi');

const routes = [
	{
		method:  'GET',
		path:    '/rooms',
		handler: handler.getRooms,
	},
	{
		method:  'GET',
		path:    '/rooms/{shortid}',
		handler: handler.getRoom,
		config:  {
			validate: {
				params: {
					shortid: Joi.string().min(7).max(14),
				},
			},
		},
	},
	{
		method:  'POST',
		path:    '/rooms',
		handler: handler.createRoom,
		config:  {
			validate: {
				payload: {
					name:  Joi.string().min(1),
					idMap: Joi.number().min(1),
				},
			},
		},
	},
	{
		method:  'PUT',
		path:    '/rooms/{shortid}',
		handler: handler.updateRoom,
		config:  {
			validate: {
				params: {
					shortid: Joi.string().min(7).max(14),
				},
				payload: {
					name: Joi.string().min(3),
				},
			},
		},
	},
	{
		method:  'DELETE',
		path:    '/rooms/{shortid}',
		handler: handler.deleteRoom,
		config:  {
			validate: {
				params: {
					shortid: Joi.string().min(7).max(14),
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
	name:    'api.room',
	version: '0.0.1',
};
