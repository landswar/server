const handler = require('./handler');
const Joi = require('joi');

const routes = [
	{
		method:  'GET',
		path:    '/friends',
		handler: handler.getFriends,
	},
	{
		method:  'GET',
		path:    '/friendsRequest',
		handler: handler.getFriendsRequest,
	},
	{
		method:  'POST',
		path:    '/friends',
		handler: handler.addFriend,
		config:  {
			validate: {
				payload: {
					friend_id: Joi.number(),
				},
			},
		},
	},
	{
		method:  'DELETE',
		path:    '/friends/{friend_id}',
		handler: handler.deleteFriend,
		config:  {
			validate: {
				params: {
					friend_id: Joi.number(),
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
	name:    'api.friend',
	version: '0.0.1',
};
