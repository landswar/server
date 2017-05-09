const Boom = require('boom');
const Player = require('./../models/player');

/* eslint-disable valid-jsdoc */

/**
 * @api {post} /login Login user.
 * @apiName loginPlayer
 * @apiGroup Player
 *
 * @apiParam {String} id The nickname or email of the player.
 *
 * @apiSuccess (200) {String} email The nickname of the Player.
 * @apiSuccess (200) {String} nickname The nickname of the Player.
 * @apiSuccess (200) {String} token The jsonwebtoken of the Player.
 *
 * @apiError (404) PlayerNotFound The id of the Player was not found.
 */
exports.login = async function (request, reply) {
	try {
		const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const where = emailReg.test(request.payload.id) ?
				{ email: request.payload.id } :
				{ nickname: request.payload.id };
		const player = await Player.get(where);
		if (!player) {
			reply(Boom.notFound());
			return;
		} else if (player.password !== request.server.methods.lib.crypt(request.payload.password)) {
			reply(Boom.badRequest('Wrong password'));
			return;
		}

		player.token = await
			request.server.methods.lib.createToken(player.id, player.nickname);

		player.password = undefined;
		reply(player);
	} catch (error) {
		logger.debug('CATCH');
		logger.error(error);
		reply(Boom.badImplementation());
	}
};
