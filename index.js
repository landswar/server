const corsHeaders = require('hapi-cors-headers');
const jwtAuth = require('hapi-auth-jwt');
const Glue = require('glue');
const good = require('good');
const logger = require('winston-lludol');
const Promise = require('bluebird');

const map = require('./map.json');
const manifest = require('./manifest.json');

global.Promise = Promise;
global.logger = logger;

const options = {
	relativeTo: __dirname,
};

const env = process.env.NODE_ENV || 'development';

logger.level = env === 'production' ? 'error' : 'debug';

manifest.connections[0].port = Number.parseInt(process.env.API_PORT, 10) || 3000;
manifest.connections[1].port = Number.parseInt(process.env.WEBSOCKET_PORT, 10) || 3001;

Glue.compose(manifest, options).then((server) =>
	Promise.all([
		server,
		server.register({
			register: good,
			options:  {
				reporters: {
					winston: [{
						module: 'hapi-good-winston',
						name:   'goodWinston',
						args:   [
							logger, {
								levels: {
									response: 'info',
									error:    'error',
								},
							},
						],
					}],
				},
			},
		}),
	])

).then(([server]) => {
	server.method('getMap', () => JSON.stringify(map));

	server.ext('onPreResponse', corsHeaders);

	server.start(() => {
		logger.info(`API listening at ${server.connections[0].info.uri}`);
		logger.info(`WebSocket listening at ${server.connections[1].info.uri}`);
	});
}).catch((error) => {
	logger.error(error);
});
