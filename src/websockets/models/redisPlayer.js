/**
 * Static class with methods to manage player entries from the Redis DB.
 */
class RedisPlayer {
	/**
	 * Return the player key in the Redis DB.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @param  {Number} idPlayer - The id of the player.
	 * @return {String} The key.
	 */
	static getKey(shortIdRoom, idPlayer) {
		return `player:${shortIdRoom}:${idPlayer}`;
	}

	/**
	 * Create a new player hash in the Redis database.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param {Object} player - The player Object.
	 * @return {Promise} The Redis hmset Promise.
	 */
	static async create(shortIdRoom, player) {
		const redisRoom = await Reflect.apply(RedisPlayer.setValues, this, [
			shortIdRoom, player.id, {
				nickname: player.nickname,
			}]);
		return redisRoom;
	}

	/**
	 * Return the content of a player in the Redis database.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @param  {String} idPlayer - The id of the player.
	 * @return {Promise} A promise with the player (null if not found).
	 */
	static async get(shortIdRoom, idPlayer) {
		const player = await this.redis.hgetall(RedisPlayer.getKey(shortIdRoom, idPlayer));
		if (this.lib.isObjectEmpty(player)) {
			return null;
		}
		return player;
	}

	/**
	 * Remove an existing player hash from the Redis database.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param {Object} player - The player Object.
	 * @return {Promise} The Redis del Promise.
	 */
	static remove(shortIdRoom, player) {
		return this.redis.del(RedisPlayer.getKey(shortIdRoom, player.id));
	}

	/**
	 * Return a Promise with every key of player in a room.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @return {Promise} A Promise with an array of id.
	 */
	static getAllPlayerInRoom(shortIdRoom) {
		return new Promise((resolve) => {
			const ids = [];
			const stream = this.redis.scanStream({
				match: `player:${shortIdRoom}:*`,
			});

			stream.on('data', (keysResult) => {
				keysResult.forEach((value) => {
					ids.push(Number.parseInt(value.split(':')[2], 10));
				});
			});

			stream.on('end', () => {
				resolve(ids);
			});
		});
	}

	/**
	 * Check if the player exists.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param  {Number} idPlayer - The id of the player.
	 * @return {Promise} A Promise with the return of redis exists.
	 */
	static exists(shortIdRoom, idPlayer) {
		return this.redis.exists(RedisPlayer.getKey(shortIdRoom, idPlayer)).then((result) => !!result);
	}

	/**
	 * Set values of the Redis hm.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param {Number} idPlayer - The id of the player.
	 * @param {Object} values - The Object values.
	 * @return {Promise} The Redis hmset Promise.
	 */
	static setValues(shortIdRoom, idPlayer, values) {
		return this.redis.hmset(RedisPlayer.getKey(shortIdRoom, idPlayer), values);
	}
}

module.exports = RedisPlayer;
