const Boom = require('boom');
const UnitService = require('./service.js');

let server = null;
let api = null;

exports.setServerInstance = function (serverInstance) {
	server = serverInstance;
	api = serverInstance.select('api');
};

/**
 * Create unit in redis DB
 * @param {Object} socket socket object
 * @param {Object} data data receive
 * @param {Function} callback response callback
 * @return {Object} socket response
 */
exports.create = async function (socket, data, callback) {
	const redisMethods = server.methods.redis;
	logger.debug('[SOCKET] unit:create', data);

	/**
	 * Send a broadcast with the unit created.
	 * @param {String} shortIdRoom - The short id of the Room.
	 * @param {Object} player - The player object.
	 * @param {Object} unit - The unit object.
	 */
	function broadcastNewUnit(shortIdRoom, player, unit) {
		socket.to(shortIdRoom).emit('unit:created', {
			idPLayer: player.id,
			nickname: player.nickname,
			unit,
		});
	}

	try {
		const schema = server.methods.joi.getSchema(['tokenPlayer', 'shortIdRoom', 'idUnit']);
		const values = await server.methods.joi.validate(data, schema);
		const decoded = await server.methods.lib.verifyJwt(values.tokenPlayer);
		const room = await redisMethods.room.get(values.shortIdRoom);

		if (!room) {
			return callback(Boom.notFound('Room not found').output.payload);
		}

		const unit = (await api.inject(`/units/${values.idUnit}`)).result;
		if (!unit) {
			return callback(Boom.notFound('Unit not found').output.payload);
		}

		const isPlayerInRoom = await redisMethods.player.exists(values.shortIdRoom, decoded.id);
		if (!isPlayerInRoom) {
			return callback(Boom.notFound('You are not a player of this room').output.payload);
		}

		const redisUnit = await redisMethods.unit.create(values.shortIdRoom, decoded.id, unit);
		broadcastNewUnit(values.shortIdRoom, decoded, redisUnit);
		return callback(redisUnit);
	} catch (error) {
		return server.methods.error.handleSocket(error, callback);
	}
};

exports.move = async function (socket, data, callback) {
	const redisMethods = server.methods.redis;
	logger.debug('[SOCKET] unit:move', data);

	/**
	 * Send a broadcast with the unit moved.
	 * @param {String} shortIdRoom - The short id of the Room.
	 * @param {Object} player - The player object.
	 * @param {Object} unit - The unit object.
	 */
	function broadcastMoveUnit(shortIdRoom, player, unit) {
		socket.to(shortIdRoom).emit('unit:moved', {
			idPLayer: player.id,
			nickname: player.nickname,
			unit,
		});
	}

	try {
		const schema = server.methods.joi.getSchema(['tokenPlayer', 'shortIdRoom', 'redisIdUnit', 'x', 'y']);
		const values = await server.methods.joi.validate(data, schema);
		const player = await server.methods.lib.verifyJwt(values.tokenPlayer);
		const redisUnit = await redisMethods.unit.get(values.shortIdRoom, player.id,
														values.redisIdUnit);

		if (!redisUnit) {
			return callback(Boom.notFound('Unit not found').output.payload);
		}

		if (!server.plugins['websocket.unit'].moveTo(redisUnit, values.x, values.y)) {
			return callback(Boom.badRequest(`Unit can't move to ${values.x},${values.y}`).output.payload);
		}

		await redisMethods.unit.setValues(redisUnit.shortIdRoom,
						redisUnit.id, redisUnit.redisId, redisUnit);

		broadcastMoveUnit(values.shortIdRoom, player, redisUnit);

		return callback(redisUnit);
	} catch (error) {
		return server.methods.error.handleSocket(error, callback);
	}
};

exports.attack = async function (socket, data, callback) {
	const redisMethods = server.methods.redis;
	logger.debug('[SOCKET] unit:attack', data);

	/**
	 * Send a broadcast with the unit moved.
	 * @param {String} shortIdRoom - The short id of the Room.
	 * @param {Object} player - The player object.
	 * @param {Object} unit - The unit object.
	 * @param {Object} target - The target object.
	 */
	function broadcastAttackUnit(shortIdRoom, player, unit, target) {
		socket.to(shortIdRoom).emit('unit:attacked', {
			idPLayer: player.id,
			nickname: player.nickname,
			unit,
			target,
		});
	}

	try {
		const schema = server.methods.joi.getSchema(['tokenPlayer', 'shortIdRoom', 'redisIdUnit', 'redisIdTarget']);
		const values = await server.methods.joi.validate(data, schema);
		const player = await server.methods.lib.verifyJwt(values.tokenPlayer);
		const redisUnit = await redisMethods.unit.get(values.shortIdRoom, player.id,
														values.redisIdUnit);
		const target = await redisMethods.unit.getUnitById(values.shortIdRoom, values.redisIdTarget);

		if (!redisUnit || !target) {
			return callback(Boom.notFound('Unit or target not found').output.payload);
		}

		if (!server.plugins['websocket.unit'].attack(redisUnit, target)) {
			return callback(Boom.badRequest('Unit cannot attack the target').output.payload);
		}

		await redisMethods.unit.setValues(redisUnit.shortIdRoom,
						redisUnit.id, redisUnit.redisId, redisUnit);
		await redisMethods.unit.setValues(target.shortIdRoom,
						target.id, target.redisId, target);

		broadcastAttackUnit(values.shortIdRoom, player, redisUnit, target);

		return callback(redisUnit);
	} catch (error) {
		return server.methods.error.handleSocket(error, callback);
	}
};

/**
 * Remove unit from redis DB
 * @param {Object} socket socket object
 * @param {Object} data data receive
 * @param {Function} callback response callback
 * @return {Object} socket response
 */
exports.remove = async function (socket, data, callback) {
	const redisMethods = server.methods.redis;
	logger.debug('[SOCKET] unit:remove', data);

	/**
	 * Send a broadcast with the unit remove.
	 * @param {String} shortIdRoom - The short id of the Room.
	 * @param {Object} player - The player object.
	 * @param {Object} unit - The unit object.
	 */
	function broadcastRemoveUnit(shortIdRoom, player, unit) {
		socket.to(shortIdRoom).emit('unit:removed', {
			idPLayer: player.id,
			nickname: player.nickname,
			unit,
		});
	}

	try {
		const schema = server.methods.joi.getSchema(['tokenPlayer', 'shortIdRoom', 'idUnit']);
		const values = await server.methods.joi.validate(data, schema);
		const decoded = await server.methods.lib.verifyJwt(values.tokenPlayer);
		const redisUnit = await redisMethods.unit.get(values.shortIdRoom, decoded.id, values.idUnit);

		if (!redisUnit) {
			return callback(Boom.notFound('Unit not found').output.payload);
		}

		await redisMethods.unit.remove(values.shortIdRoom, decoded.id, redisUnit.redisId);
		broadcastRemoveUnit(values.shortIdRoom, decoded, redisUnit);
		return callback(redisUnit);
	} catch (error) {
		return server.methods.error.handleSocket(error, callback);
	}
};
