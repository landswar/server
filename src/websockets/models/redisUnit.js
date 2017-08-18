/**
 * Static class with methods to manage player entries from the Redis DB.
 */
class RedisUnit {
	/**
	 * Return the player key in the Redis DB.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @param  {Number} idPlayer - The id of the player.
	 * @param  {Number} redisIdUnit - The mysql id of the unit.
	 * @return {String} The key.
	 */
	static getKey(shortIdRoom, idPlayer, redisIdUnit) {
		return `unit:${shortIdRoom}:${idPlayer}:${redisIdUnit}`;
	}

	/**
	 * Unit to parse (cast string to int)
	 * @param {Object} unit The unit to parse
	 * @return {Object} The unit parsed
	 */
	static parseModel(unit) {
		unit.move = +unit.move;
		unit.ammo1 = +unit.ammo1;
		unit.ammo2 = +unit.ammo2;
		unit.fuel = +unit.fuel;
		unit.rangeMin = +unit.rangeMin;
		unit.rangeMax = +unit.rangeMax;
		unit.cost = +unit.cost;
		unit.vision = +unit.vision;
		unit.x = +unit.x;
		unit.y = +unit.y;
		unit.life = +unit.life;
		return unit;
	}

	/**
	 * Return the next redis id to give for a the created unit.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @param  {Number} idPlayer - The id of the player.
	 * @return {Number} Id of the unit.
	 */
	static async getUnitId(shortIdRoom, idPlayer) {
		/**
		 * @return {String} The key of the unit id incrementeur
		 */
		function getKey() {
			return `unit:id:${shortIdRoom}:${idPlayer}`;
		}

		const exist = await this.redis.exists(getKey());
		if (!exist) {
			await this.redis.set(getKey(), 0);
		}
		let ret = await this.redis.get(getKey());
		++ret;
		await this.redis.set(getKey(), ret);
		return ret;
	}

	/**
	 * Create a new unit hash in the Redis database.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param {Object} idPlayer - The player id.
	 * @param {Object} unit - The unit Object.
	 * @return {Promise} The Redis hmset Promise.
	 */
	static async create(shortIdRoom, idPlayer, unit) {
		unit.redisId = await Reflect.apply(RedisUnit.getUnitId, this, [shortIdRoom, idPlayer]);
		unit.idPlayer = idPlayer;
		unit.shortIdRoom = shortIdRoom;
		unit.x = 0;
		unit.y = 0;
		await Reflect.apply(RedisUnit.setValues, this,
			[shortIdRoom, idPlayer, unit.redisId, unit]);
		return unit;
	}

	/**
	 * Return the content of a unit in the Redis database.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @param  {String} idPlayer - The id of the player.
	 * @param  {Number} redisIdUnit - The id of the unit (in redis DB).
	 * @return {Promise} A promise with the player (null if not found).
	 */
	static async get(shortIdRoom, idPlayer, redisIdUnit) {
		const unit = await this.redis.hgetall(RedisUnit.getKey(shortIdRoom, idPlayer, redisIdUnit));
		if (this.lib.isObjectEmpty(unit)) {
			return null;
		}
		return RedisUnit.parseModel(unit);
	}

	/**
	 * Remove an existing player hash from the Redis database.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param {Object} idPlayer - Id of the player.
	 * @param {Object} redisIdUnit - Id of the unit.
	 * @return {Promise} The Redis del Promise.
	 */
	static remove(shortIdRoom, idPlayer, redisIdUnit) {
		return this.redis.del(RedisUnit.getKey(shortIdRoom, idPlayer, redisIdUnit));
	}

	/**
	 * Return a Promise with every key of unit of the player.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @param  {String} idPlayer - The id of the player.
	 * @return {Promise} A Promise with an array of id.
	 */
	static getAllUnitOfPlayer(shortIdRoom, idPlayer) {
		return new Promise((resolve) => {
			const ids = [];
			const stream = this.redis.scanStream({
				match: `unit:${shortIdRoom}:${idPlayer}:*`,
			});

			stream.on('data', (keysResult) => {
				keysResult.forEach((value) => {
					ids.push(Number.parseInt(value.split(':')[3], 10));
				});
			});

			stream.on('end', () => {
				resolve(ids);
			});
		});
	}

	/**
	 * Return a Promise with every key of unit of the player.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @param  {String} idUnit - The id of the Unit.
	 * @return {Promise} A Promise with an array of id.
	 */
	static getUnitById(shortIdRoom, idUnit) {
		return new Promise((resolve) => {
			let unitKey = null;
			const stream = this.redis.scanStream({
				match: `unit:${shortIdRoom}:*:${idUnit}`,
			});

			stream.on('data', (keysResult) => {
				unitKey = keysResult[0];
			});

			stream.on('end', async () => {
				if (!unitKey) {
					resolve(false);
				} else {
					const unit = await this.redis.hgetall(unitKey);
					resolve(RedisUnit.parseModel(unit));
				}
			});
		});
	}

	/**
	 * Check if the unit exists.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param  {Number} idPlayer - The id of the player.
	 * @param  {Number} redisIdUnit - The id of the unit (in redis DB).
	 * @return {Promise} A Promise with the return of redis exists.
	 */
	static exists(shortIdRoom, idPlayer, redisIdUnit) {
		return this.redis.exists(RedisUnit.getKey(shortIdRoom, idPlayer, redisIdUnit))
            .then((result) => !!result);
	}

	/**
	 * Set values of the Redis hm.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param {Number} idPlayer - The id of the player.
	 * @param  {Number} redisIdUnit - The id of the unit (in redis DB).
	 * @param {Object} values - The Object values.
	 * @return {Promise} The Redis hmset Promise.
	 */
	static setValues(shortIdRoom, idPlayer, redisIdUnit, values) {
		return this.redis.hmset(RedisUnit.getKey(shortIdRoom, idPlayer, redisIdUnit), values);
	}
}

module.exports = RedisUnit;
