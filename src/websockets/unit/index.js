const socketAsPromised = require('socket.io-as-promised');
const handler = require('./handler');
const UnitService = require('./service');

const after = function (server, next) {
	const io = server.plugins.hapio.io;
	io.use(socketAsPromised());

	io.on('connection', (socket) => {
		logger.info(`[socket] New connection ${socket.id}`);

		socket.on('unit:create', (data, callback) => handler.create(socket, data, callback));
		socket.on('unit:remove', (data, callback) => handler.remove(socket, data, callback));
		socket.on('unit:move', (data, callback) => handler.move(socket, data, callback));
		socket.on('unit:attack', (data, callback) => handler.attack(socket, data, callback));
	});

	return next();
};

exports.register = function (server, options, next) {
	handler.setServerInstance(server);
	server.dependency('hapio', after);

	const unitService = UnitService(server);
	server.expose('moveTo', unitService.moveTo);
	server.expose('attack', unitService.attack);

	next();
};

exports.register.attributes = {
	name:    'websocket.unit',
	version: '0.0.1',
};
