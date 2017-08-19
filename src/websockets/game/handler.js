const Boom = require('boom');

let server = null;

exports.setServerInstance = function (serverInstance) {
	server = serverInstance;
};

exports.endTurn = async function (io, socket, data, callback) {
	logger.debug('[SOCKET] game:endTurn', data);

	const redisMethods = server.methods.redis;

	try {
		const schema = server.methods.joi.getSchema(['tokenPlayer', 'shortIdRoom']);
		const values = await server.methods.joi.validate(data, schema);
		const decoded = await server.methods.lib.verifyJwt(values.tokenPlayer);
		const room = await redisMethods.room.get(values.shortIdRoom);

		if (!room || !io.sockets.adapter.rooms.hasOwnProperty(values.shortIdRoom)) {
			return callback(Boom.notFound('Room not found').output.payload);
		}

		const isPlayerInRoom = await redisMethods.player.exists(values.shortIdRoom, decoded.id);
		if (!isPlayerInRoom) {
			return callback(Boom.notFound('You are not in this room').output.payload);
		} else if (room.playerTurn !== decoded.id) {
			return callback(Boom.notFound('It\'s not your turn').output.payload);
		}

		const playersOrders = room.playersOrders.split(',').map((n) => Number.parseInt(n, 10));
		const indexPlayerInOrder = playersOrders.indexOf(decoded.id);

		if (indexPlayerInOrder === playersOrders.length - 1) {
			room.playerTurn = playersOrders[0];
			++room.nbTurn;
		} else {
			room.playerTurn = playersOrders[indexPlayerInOrder + 1];
		}

		await redisMethods.room.setValues(values.shortIdRoom, {
			playerTurn: Number.parseInt(room.playerTurn, 10),
			nbTurn:     room.nbTurn,
		});

		const clients = Object.keys(io.sockets.adapter.rooms[values.shortIdRoom].sockets);
		clients.forEach((clientId) => {
			const clientSocket = io.sockets.connected[clientId];

			clientSocket.emit('game:nextPlayer', {
				nbTurn:   room.nbTurn,
				yourTurn: clientSocket.playerId === room.playerTurn,
			});
		});

		return callback({
			yourTurn: false,
			nbTurn:   room.nbTurn,
		});
	} catch (error) {
		return server.methods.error.handleSocket(error, callback);
	}
};
