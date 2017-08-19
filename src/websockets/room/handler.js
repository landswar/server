const Boom = require('boom');

let server = null;

exports.setServerInstance = function (serverInstance) {
	server = serverInstance;
};

exports.join = async function (io, socket, data, callback) {
	const redisMethods = server.methods.redis;
	logger.debug('[SOCKET] room:join', data);

	/**
	 * Join the Socket room and send a broadcast to it.
	 * @param {String} shortIdRoom - The short id of the Room.
	 * @param {Number} id - The user unique id.
	 * @param {String} nickname - The nickname of the user.
	 * @param {Boolean} isNew - True if the user is new to the room.
	 */
	function joinAndBroadcast(shortIdRoom, id, nickname, isNew) {
		socket.playerId = id;
		socket.join(shortIdRoom);
		socket.to(shortIdRoom).emit('room:joined', {
			id,
			nickname,
			isNew,
		});
	}

	/**
	 * Start the game if it has to be started.
	 * @param {String} shortIdRoom - The short id of the Room.
	 * @param {Object} room - The Room Object from the Redis database.
	 */
	async function startGameAndBroadcast(shortIdRoom, room) {
		if (room.nbTurn === 0 && !server.plugins['websocket.room'].isFreeSpace(room)) {
			const gameData = await server.plugins['websocket.room'].start(shortIdRoom, room);

			const clients = Object.keys(io.sockets.adapter.rooms[shortIdRoom].sockets);
			clients.forEach((clientId) => {
				const clientSocket = io.sockets.connected[clientId];

				clientSocket.emit('game:nextPlayer', {
					nbTurn:   gameData.nbTurn,
					yourTurn: clientSocket.playerId === gameData.playerTurn,
				});
			});
		}
	}

	try {
		const schema = server.methods.joi.getSchema(['tokenPlayer', 'shortIdRoom']);
		const values = await server.methods.joi.validate(data, schema);
		const decoded = await server.methods.lib.verifyJwt(values.tokenPlayer);
		const room = await redisMethods.room.get(values.shortIdRoom);

		if (!room) {
			return callback(Boom.notFound('Room not found').output.payload);
		}

		const isPlayerInRoom = await redisMethods.player.exists(values.shortIdRoom, decoded.id);

		if (isPlayerInRoom) {
			joinAndBroadcast(values.shortIdRoom, decoded.id, decoded.nickname, false);
			callback(room);
			startGameAndBroadcast(values.shortIdRoom, room);
			return Promise.resolve();
		}

		if (server.plugins['websocket.room'].isFreeSpace(room)) {
			await redisMethods.player.create(values.shortIdRoom, {
				id:       decoded.id,
				nickname: decoded.nickname,
			});
			++room.nbPlayer;
			await redisMethods.room.setValues(values.shortIdRoom, {
				nbPlayer: room.nbPlayer,
			});

			joinAndBroadcast(values.shortIdRoom, decoded.id, decoded.nickname, true);

			callback(room);

			await startGameAndBroadcast(values.shortIdRoom, room);

			return Promise.resolve();
		}

		return callback({ message: 'No space left in the room' });
	} catch (error) {
		return server.methods.error.handleSocket(error, callback);
	}
};

exports.leave = async function (socket, data, callback) {
	const redisMethods = server.methods.redis;
	logger.debug('[SOCKET] room:leave', data);

	/**
	 * Leave the Socket room and broadcast it.
	 * @param {String} shortIdRoom - The short id of the Room.
	 * @param {Number} id - The user unique id.
	 * @param {String} nickname - The nickname of the user.
	 */
	function leaveAndBroadCast(shortIdRoom, id, nickname) {
		socket.leave(shortIdRoom);
		socket.to(shortIdRoom).emit('room:left', {
			id,
			nickname,
		});
	}

	try {
		const schema = server.methods.joi.getSchema(['tokenPlayer', 'shortIdRoom']);
		const values = await server.methods.joi.validate(data, schema);
		const decoded = await server.methods.lib.verifyJwt(values.tokenPlayer);
		const room = await redisMethods.room.get(values.shortIdRoom);

		if (!room) {
			return callback(Boom.notFound('Room not found').output.payload);
		}

		const isPlayerInRoom = await redisMethods.player.exists(values.shortIdRoom, decoded.id);

		if (!isPlayerInRoom) {
			return callback(Boom.badRequest('You\'re not in this room').output.payload);
		}

		await redisMethods.player.remove(values.shortIdRoom, {
			id:       decoded.id,
			nickname: decoded.nickname,
		});
		--room.nbPlayer;
		await redisMethods.room.setValues(values.shortIdRoom, {
			nbPlayer: room.nbPlayer,
		});

		leaveAndBroadCast(values.shortIdRoom, decoded.id, decoded.nickname);
		return callback(room);
	} catch (error) {
		return server.methods.error.handleSocket(error, callback);
	}
};
