const Boom = require('boom');
const Player = require('./../models/player');

/* eslint-disable valid-jsdoc */

/**
 * @api {get} /players Request every Player.
 * @apiName getPlayers
 * @apiGroup Player
 *
 * @apiSuccess (200) {Object[]} players List of Players.
 * @apiSuccess (200) {Number} players.id Player unique ID.
 * @apiSuccess (200) {String} players.email Email of the player.
 * @apiSuccess (200) {String} players.nickname Nickname of the player.
 */
exports.getPlayers = async function (request, reply) {
	try {
		const players = await Player.getAll(['id', 'email', 'nickname']);

		reply(players);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {get} /player/:id Request Player informations.
 * @apiName getPlayer
 * @apiGroup Player
 *
 * @apiParam {Number} id Player unique ID.
 *
 * @apiSuccess (200) {Number} id Player unique ID.
 * @apiSuccess (200) {String} email Email of the player.
 * @apiSuccess (200) {String} nickname Nickname of the player.
 *
 * @apiError (404) PlayerNotFound The id of the Room was not found.
 */
exports.getPlayer = async function (request, reply) {
	try {
		const player = await Player.get({ id: request.params.id }, ['id', 'email', 'nickname']);

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
			email:    request.payload.email,
			nickname: request.payload.nickname,
			password: request.server.methods.lib.crypt(request.payload.password),
		});

		newPlayer.token = await
			request.server.methods.lib.createToken(newPlayer.id, newPlayer.nickname);

		newPlayer.password = undefined;
		reply(newPlayer);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};
