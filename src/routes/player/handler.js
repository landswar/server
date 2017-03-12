const Boom = require('boom');
const Player = require('./../models/player');

exports.createPlayer = async function (request, reply) {
	try {
		const player = await Player.get({
			nickname: request.payload.nickname,
		});

		if (player) {
			Boom.badRequest('Name already taken');
		}

		const newPlayer = await Player.create({
			nickname: request.payload.nickname,
		});

		newPlayer.token = await
			request.server.methods.lib.createToken(newPlayer.id, newPlayer.nickname);

		reply(newPlayer);
	} catch (error) {
		logger.error(error);
		reply(error);
	}
};
