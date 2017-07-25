const Boom = require('boom');
const shortid = require('shortid');

const Room = require('../../models/room');
const Map = require('../../models/map');

/* eslint-disable valid-jsdoc */

/**
 * @api {get} /rooms Request every Room.
 * @apiName getRooms
 * @apiGroup Room
 *
 * @apiSuccess (200) {Object[]} rooms List of Rooms.
 * @apiSuccess (200) {Number} rooms.id Rooms unique ID.
 * @apiSuccess (200) {Number} rooms.idMap The id of the map associated with the room.
 * @apiSuccess (200) {String} rooms.name Name of the room.
 * @apiSuccess (200) {Number} rooms.maxPlayer Number of players allowed to enter in the room.
 * @apiSuccess (200) {String} rooms.shortid ShortID of the room.
 */
exports.getRooms = async function (request, reply) {
	try {
		const rooms = await Room.getAll();

		reply(rooms);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {get} /rooms/:id Request Room informations.
 * @apiName getRoom
 * @apiGroup Room
 *
 * @apiParam {Number} id Rooms unique ID.
 *
 * @apiSuccess (200) {Number} id Rooms unique ID.
 * @apiSuccess (200) {String} name Name of the room.
 * @apiSuccess (200) {Number} idMap The id of the map associated with the room.
 * @apiSuccess (200) {Number} maxPlayer Number of players allowed to enter in the room.
 * @apiSuccess (200) {String} shortid ShortID of the room.
 *
 * @apiError (404) RoomNotFound The id of the Room was not found.
 */
exports.getRoom = async function (request, reply) {
	try {
		const room = await Room.get({
			shortid: request.params.shortid,
		});

		if (!room) {
			reply(Boom.notFound());
			return;
		}

		reply(room);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {post} /rooms Create a Room.
 * @apiName postRoom
 * @apiGroup Room
 *
 * @apiParam {String} name The name of the room.
 * @apiParam {Number} idMap The id of the map associated with the room.
 *
 * @apiSuccess (200) {String} name Name of the room.
 * @apiSuccess (200) {Number} idMap The id of the map associated with the room.
 * @apiSuccess (200) {Number} maxPlayer Number of players allowed to enter in the room.
 * @apiSuccess (200) {String} shortid ShortID of the room.
 *
 * @apiError (404) MapNotFound The id of the Map was not found.
 */
exports.createRoom = async function (request, reply) {
	try {
		const map = await Map.get({ id: request.payload.idMap });

		if (!map) {
			reply(Boom.notFound('Map not found'));
			return;
		}

		const room = await Room.create({
			name:       request.payload.name,
			max_player: 2,
			shortid:    shortid.generate(),
			owner:      request.auth.credentials.id,
			id_map:     map.id,
		});

		await request.server.methods.redis.room.create(room, map);

		reply({
			name:      room.name,
			idMap:     map.id,
			maxPlayer: room.maxPlayer,
			shortid:   room.shortid,
			owner:     room.owner,
		});
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {put} /rooms/:id Update a Room.
 * @apiName putRoom
 * @apiGroup Room
 *
 * @apiParam {Number} id Room unique ID.
 * @apiParam {String} name The name of the room.
 *
 * @apiSuccess (200) {String} name Name of the room.
 * @apiSuccess (200) {Number} maxPlayer Number of players allowed to enter in the room.
 * @apiSuccess (200) {String} shortid ShortID of the room.
 *
 * @apiError (404) PlayerNotFound The id of the Player was not found.
 */
exports.updateRoom = async function (request, reply) {
	try {
		const room = await Room.get({ shortid: request.params.shortid });

		if (!room) {
			reply(Boom.notFound());
			return;
		}

		const roomUpdated = await Room.update({ shortid: request.params.shortid }, {
			name:   request.payload.name,
			id_map: request.payload.idMap,
		});

		reply(roomUpdated);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {delete} /rooms/:id Delete a Room.
 * @apiName deleteRoom
 * @apiGroup Room
 *
 * @apiParam {Number} id Room unique ID.
 *
 * @apiSuccess (200) RoomDeleted
 *
 * @apiError (404) RoomNotFound The id of the room was not found.
 */
exports.deleteRoom = async function (request, reply) {
	try {
		const player = await Room.get({ shortid: request.params.shortid });

		if (!player) {
			reply(Boom.notFound());
			return;
		}

		reply(await Room.delete({ shortid: request.params.shortid }));
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};
