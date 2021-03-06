const Boom = require('boom');
const Player = require('./../../models/player');
const Joi = require('joi');

/* eslint-disable valid-jsdoc */

/**
 * @api {post} /login Login user.
 * @apiName loginPlayer
 * @apiGroup Auth
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
		const where = Joi.validate(request.payload.id, Joi.string().email()).error ?
				{ nickname: request.payload.id } :
				{ email: request.payload.id };
		const player = await Player.get(where);
		if (!player) {
			reply(Boom.notFound('Wrong email or nickname'));
			return;
		} else if (player.password !== request.server.methods.lib.crypt(request.payload.password)) {
			reply(Boom.badRequest('Wrong password'));
			return;
		}

		player.token = await
			request.server.methods.lib.createToken(player.id, player.nickname);

		Reflect.deleteProperty(player, 'password');
		reply(player);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {post} /checkToken Check Token validity.
 * @apiName checkToken
 * @apiGroup Auth
 *
 * @apiParam {String} token The token to check.
 *
 * @apiSuccess (200) {String} email The nickname of the Player.
 * @apiSuccess (200) {String} nickname The nickname of the Player.
 *
 * @apiError (400) TokenNotValid The token is not valid.
 * @apiError (404) UserNotFound The user corresponding to the given token cannot be found.
 */
exports.checkToken = async function (request, reply) {
	try {
		const token = await
			request.server.methods.lib.verifyJwt(request.payload.token);

		if (!token || token === 'Invalid Token') {
			reply(Boom.badRequest('Invalid Token'));
			return;
		}

		const player = await Player.get({ id: token.id }, ['id', 'nickname', 'email']);
		if (!player) {
			reply(Boom.notFound());
			return;
		}

		reply(player);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};
