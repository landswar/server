const socketAsPromised = require('socket.io-as-promised');
const handler = require('./handler');
const RoomService = require('./service');

const after = function (server, next) {
	const io = server.plugins.hapio.io;
	io.use(socketAsPromised());

	io.on('connection', (socket) => {
		logger.info(`[socket] New connection ${socket.id}`);

		socket.on('room:join', (data, callback) => handler.join(io, socket, data, callback));
		socket.on('room:leave', (data, callback) => handler.leave(socket, data, callback));
	});

	const roomService = RoomService(server);
	server.expose('isFreeSpace', roomService.isFreeSpace);
	server.expose('start', roomService.start);

	return next();
};

exports.register = function (server, options, next) {
	handler.setServerInstance(server);

	server.dependency(['hapio', 'redis.models'], after);

	next();
};

exports.register.attributes = {
	name:    'websocket.room',
	version: '0.0.1',
};
