const socketAsPromised = require('socket.io-as-promised');
const handler = require('./handler');

const after = function (server, next) {
	const io = server.plugins.hapio.io;
	io.use(socketAsPromised());

	io.on('connection', (socket) => {
		logger.info(`[socket] New connection ${socket.id}`);

		socket.on('unit:create', (data, callback) => handler.create(socket, data, callback));
		socket.on('unit:remove', (data, callback) => handler.remove(socket, data, callback));
	});

	return next();
};

exports.register = function (server, options, next) {
	handler.setServerInstance(server);
	server.dependency('hapio', after);

	next();
};

exports.register.attributes = {
	name:    'websocket.unit',
	version: '0.0.1',
};
