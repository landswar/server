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
];

exports.register = function (server, options, next) {
	server.route(routes);
	next();
};

exports.register.attributes = {
	name:    'api.map',
	version: '0.0.1',
};
