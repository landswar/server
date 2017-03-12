const Boom = require('boom');
const shortid = require('shortid');

const Room = require('./../models/room');

exports.getRooms = async function (request, reply) {
	try {
		const rooms = await Room.getAll();

		reply(rooms);
	} catch (error) {
		logger.error(error);
		reply(error);
	}
};

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
		reply(error);
	}
};

exports.createRoom = async function (request, reply) {
	try {
		const room = await Room.create({
			name:       request.payload.name,
			max_player: 2,
			shortid:    shortid.generate(),
		});
		room.map = request.server.methods.getMap();
		await request.server.methods.redis.room.create(room);

		reply({
			name:      room.name,
			maxPlayer: room.maxPlayer,
			shortid:   room.shortid,
		});
	} catch (error) {
		logger.error(error);
		reply(error);
	}
};
