const Boom = require('boom');
const RoomService = require('./service');

let server = null;

exports.setServerInstance = function (serverInstance) {
	server = serverInstance;
};

exports.join = async function (socket, data, callback) {
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
		socket.join(shortIdRoom);
		socket.to(shortIdRoom).emit('room:joined', {
			id,
			nickname,
			isNew,
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

		if (isPlayerInRoom) {
			joinAndBroadcast(values.shortIdRoom, decoded.id, decoded.nickname, false);
			return callback(room);
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

			if (!server.plugins['websocket.room'].isFreeSpace(room)) {
				RoomService.start(values.shortIdRoom, room);
			}

			joinAndBroadcast(values.shortIdRoom, decoded.id, decoded.nickname, true);
			return callback(room);
		}

		return callback({ message: 'No space left in the room' });
	} catch (error) {
		return server.methods.error.handleSocket(error, callback);
	}
};
