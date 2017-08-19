const socketAsPromised = require('socket.io-as-promised');
const handler = require('./handler');
// const GameService = require('./service');

const after = function (server, next) {
	const io = server.plugins.hapio.io;
	io.use(socketAsPromised());

	io.on('connection', (socket) => {
		socket.on('game:endTurn', (data, callback) => handler.endTurn(io, socket, data, callback));
	});

	// const gameService = GameService(server);

	return next();
};

exports.register = function (server, options, next) {
	handler.setServerInstance(server);

	server.dependency(['hapio', 'redis.models'], after);

	next();
};

exports.register.attributes = {
	name:    'websocket.game',
	version: '0.0.1',
};
