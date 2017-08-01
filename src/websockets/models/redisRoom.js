/**
 * Static class with methods to manage room entries from the Redis DB.
 */
class RedisRoom {
	/**
	 * Return the key of a room in the Redis DB.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @return {String} The key.
	 */
	static getKey(shortIdRoom) {
		return `room:${shortIdRoom}`;
	}

	/**
	 * Create a new room hash in the Redis database.
	 * @param {Object} room - The room Object.
	 * @param {Object} map - The map Object.
	 * @return {Promise} The Redis hmset Promise.
	 */
	static async create(room, map) {
		const redisRoom = await Reflect.apply(RedisRoom.setValues, this, [
			room.shortid, {
				name:        room.name,
				nbPlayer:    0,
				nbMaxPlayer: room.maxPlayer,
				nbTurn:      0,
				playerTurn:  '',
				map:         map.data,
			}]);
		return redisRoom;
	}

	/**
	 * Return the content of a room in the Redis database.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @return {Promise} A promise with the room (null if not found).
	 */
	static async get(shortIdRoom) {
		const room = await this.redis.hgetall(RedisRoom.getKey(shortIdRoom));
		if (this.lib.isObjectEmpty(room)) {
			return null;
		}

		room.nbMaxPlayer = Number.parseInt(room.nbMaxPlayer, 10);
		room.nbPlayer = Number.parseInt(room.nbPlayer, 10);
		room.nbTurn = Number.parseInt(room.nbTurn, 10);
		room.playerTurn = Number.parseInt(room.playerTurn, 10);
		room.map = JSON.parse(room.map);
		return room;
	}

	/**
	 * Set values of the Redis hm.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param {Object} values - The Object values.
	 * @return {Promise} The Redis hmset Promise.
	 */
	static setValues(shortIdRoom, values) {
		return this.redis.hmset(RedisRoom.getKey(shortIdRoom), values);
	}
}

module.exports = RedisRoom;
