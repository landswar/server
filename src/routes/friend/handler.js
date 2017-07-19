const Boom = require('boom');
const Friend = require('../../models/friend');
const Player = require('../../models/player');

/* eslint-disable valid-jsdoc */

/**
 * @api {get} /friends Add a new friend.
 * @apiName addFriends
 * @apiGroup Friend
 *
 * @apiSuccess (200) {Object[]} friends List of Friend.
 * @apiSuccess (200) {Number} friends.id Player unique ID.
 * @apiSuccess (200) {String} friends.email Email of the player.
 * @apiSuccess (200) {String} friends.nickname Nickname of the player.
 */
exports.addFriend = async function (request, reply) {
	try {
		const userId = request.auth.credentials.id;
		const friendId = request.payload.friend_id;
		if (userId === friendId) {
			reply(Boom.badRequest('You can\'t be friend with yourself'));
			return;
		}
		// Add relation between me and my friend
		await Friend.create({
			user_id:   userId,
			friend_id: friendId,
		});
		// Add relation between my friend and me
		await Friend.create({
			user_id:   friendId,
			friend_id: userId,
		});
		reply({});
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {get} /friends Request every Friends.
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
		const friends = await Player.getRelated({ id: request.auth.credentials.id },
			[{
				friends: (qb) => qb.columns('players.id', 'players.nickname', 'players.email'),
			}], ['id', 'nickname', 'email']);

		reply(friends.friends);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};
