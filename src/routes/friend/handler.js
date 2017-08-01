const Boom = require('boom');
const Friend = require('../../models/friend');
const Player = require('../../models/player');

/* eslint-disable valid-jsdoc */

/**
 * @api {post} /friends Add a new friend.
 * @apiName addFriends
 * @apiGroup Friend
 *
 * @apiSuccess (200) {Object} friends List of Friend.
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

		const isFriend = await Friend.get({ user_id: userId, friend_id: friendId });
		if (isFriend) {
			reply(Boom.badRequest('You are already friend'));
			return;
		}
		const friend = await Player.get(friendId, ['id', 'nickname', 'email']);
		if (!friend) {
			reply(Boom.notFound());
			return;
		}
		// Add relation between me and my friend
		await Friend.create({
			user_id:   userId,
			friend_id: friendId,
		});
		// Add relation between my friend and me
/*		await Friend.create({
			user_id:   friendId,
			friend_id: userId,
		});
*/
		reply(friend);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {delete} /friends Delete friend.
 * @apiName addFriends
 * @apiGroup Friend
 *
 * @apiSuccess (200).
 */
exports.deleteFriend = async function (request, reply) {
	try {
		const userId = request.auth.credentials.id;
		const friendId = request.params.friend_id;
		const friendToUser = await Friend.get({ user_id: friendId, friend_id: userId });
		const userToFriend = await Friend.get({ user_id: userId, friend_id: friendId });
		if (!friendToUser && !userToFriend) {
			reply(Boom.badRequest('You\'re not friend'));
			return;
		}
		// need to delete the link user -> friend
		if (userToFriend) {
			await Friend.delete({
				user_id:   userId,
				friend_id: friendId,
			});
		}
		// need to delete the link friend -> user
		if (friendToUser) {
			await Friend.delete({
				user_id:   friendId,
				friend_id: userId,
			});
		}
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

/**
 * @api {get} /friendsRequest Get friend request.
 * @apiName getFriends
 * @apiGroup Friend
 *
 * @apiSuccess (200) {Object[]} friends List of Friend.
 * @apiSuccess (200) {Number} friends.id Player unique ID.
 * @apiSuccess (200) {String} friends.email Email of the player.
 * @apiSuccess (200) {String} friends.nickname Nickname of the player.
 */
exports.getFriendsRequest = async function (request, reply) {
	try {
		const friends = await Player.getRelated({ id: request.auth.credentials.id },
			[{
				friendsRequest: (qb) => qb.columns('players.id', 'players.nickname', 'players.email'),
			}], ['id', 'nickname', 'email']);

		reply(friends.friendsRequest);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};
