const RoomService = require('./service');

let server = null;

exports.setServerInstance = function (serverInstance) {
	server = serverInstance;
};

exports.join = async function (data, callback) {
	const redisMethods = server.methods.redis;
	logger.debug('[SOCKET] room:join', data);

	try {
		const schema = server.methods.joi.getSchema(['tokenPlayer', 'shortIdRoom']);
		const values = await server.methods.joi.validate(data, schema);
		const decoded = await server.methods.lib.verifyJwt(values.tokenPlayer);
		const room = await redisMethods.room.get(values.shortIdRoom);

		if (!room) {
			throw new server.methods.error.Custom('Room not found');
		}

		const isPlayerInRoom = await redisMethods.player.exists(values.shortIdRoom, decoded.id);

		if (isPlayerInRoom) {
			return callback(room);
		} else if (server.plugins['websocket.room'].isFreeSpace(room)) {
			await redisMethods.player.create(values.shortIdRoom, {
				id:       decoded.id,
				nickname: decoded.nickname,
			});
			++room.nbPlayer;
			await redisMethods.room.setValues(values.shortIdRoom, {
				nbPlayer: room.nbPlayer,
			});

			if (!server.plugins['websocket.room'].isFreeSpace(room)) {
				RoomService.start(values.shortIdRoom, room);
			}

			// BROADCAST roomPlayerJoined
			return callback(room);
		}

		return callback({ message: 'No space left in the room' });
	} catch (error) {
		return server.methods.error.handleSocket(error, callback);
	}
};
