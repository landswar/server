const Boom = require('boom');
const Player = require('./../models/player');

/* eslint-disable valid-jsdoc */

/**
 * @api {post} /player Create a Player.
 * @apiName postPlayer
 * @apiGroup Player
 *
 * @apiParam {String} nickname The nickname of the Player.
 *
 * @apiSuccess (200) {String} nickname The nickname of the Player.
 * @apiSuccess (200) {String} token The jsonwebtoken of the Player.
 *
 * @apiError (400) PlayerBadRequest The nickname already exists.
 */
exports.createPlayer = async function (request, reply) {
	try {
		const player = await Player.get({
			nickname: request.payload.nickname,
		});

		if (player) {
			reply(Boom.badRequest('Nickname already exists'));
			return;
		}

		const newPlayer = await Player.create({
			nickname: request.payload.nickname,
		});

		newPlayer.token = await
			request.server.methods.lib.createToken(newPlayer.id, newPlayer.nickname);

		reply(newPlayer);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};
