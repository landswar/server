const Boom = require('boom');
const Friend = require('../../models/friend');
const Player = require('../../models/player');

/* eslint-disable valid-jsdoc */

/**
 * @api {get} /friends Request every Player.
 * @apiName getFriends
 * @apiGroup Friend
 *
 * @apiSuccess (200) {Object[]} friends List of Friend.
 * @apiSuccess (200) {Number} friends.id Player unique ID.
 * @apiSuccess (200) {String} friends.email Email of the player.
 * @apiSuccess (200) {String} friends.nickname Nickname of the player.
 */
exports.getFriends = async function (request, reply) {
	try {
		console.log(await Player._Model.forge({ id: 1 }).fetch({ withRelated: ['friends'] }));
		const players = await Friend.getAll();

		reply(players);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};
