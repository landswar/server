/**
 * Static class with methods to manage player entries from the Redis DB.
 */
class RedisUnit {
	/**
	 * Return the player key in the Redis DB.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @param  {Number} idPlayer - The id of the player.
	 * @param  {Number} redisIdUnit - The Redis unique ID of the Unit.
	 * @return {String} The key.
	 */
	static getKey(shortIdRoom = '*', idPlayer = '*', redisIdUnit = '*') {
		return `unit:${shortIdRoom}:${idPlayer}:${redisIdUnit}`;
	}

	/**
	 * Return the Redis unique ID key for a Player in a Room.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param {Number} idPlayer - The id of the player.
	 * @return {String} The key.
	 */
	static getRedisIdKey(shortIdRoom, idPlayer) {
		return `unit:${shortIdRoom}:${idPlayer}`;
	}

	/**
	 * Return the next unique unit ID for the Redis database.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @param  {Number} idPlayer - The id of the player.
	 * @return {Number} The next ID.
	 */
	static async getNextRedisId(shortIdRoom, idPlayer) {
		const exist = await this.redis.exists(RedisUnit.getRedisIdKey(shortIdRoom, idPlayer));

		let currentId = 1;
		if (exist) {
			await this.redis.incr(RedisUnit.getRedisIdKey(shortIdRoom, idPlayer));
			currentId = await this.redis.get(RedisUnit.getRedisIdKey(shortIdRoom, idPlayer));
		} else {
			await this.redis.set(RedisUnit.getRedisIdKey(shortIdRoom, idPlayer), 1);
		}

		return currentId;
	}

	/**
	 * Create a new unit hash in the Redis database.
	 * @param {String} shortIdRoom - The shortid of the room.
	 * @param {Object} idPlayer - The player id.
	 * @param {Object} unit - The unit Object.
	 * @return {Promise} The Redis hmset Promise.
	 */
	static async create(shortIdRoom, idPlayer, unit) {
		const nextRedisId = await Reflect.apply(
			RedisUnit.getNextRedisId, this,
			[shortIdRoom, idPlayer]
		);
		const redisUnit = {
			id:      unit.id,
			redisId: nextRedisId,
			x:       0,
			y:       0,
			life:    unit.life,
			ammo1:   unit.ammo1,
			ammo2:   unit.ammo2,
			fuel:    unit.fuel,
		};

		await Reflect.apply(RedisUnit.setValues, this, [
			shortIdRoom, idPlayer, nextRedisId, redisUnit,
		]);
		return redisUnit;
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

	/**
	 * Unit to parse (cast string to int)
	 * @param {Object} unit The unit to parse
	 * @return {Object} The unit parsed
	 */
	static parseModel(unit) {
		unit.id = Number.parseInt(unit.id, 10);
		unit.x = Number.parseInt(unit.x, 10);
		unit.y = Number.parseInt(unit.y, 10);
		unit.life = Number.parseInt(unit.life, 10);
		unit.ammo1 = Number.parseInt(unit.ammo1, 10);
		unit.ammo2 = Number.parseInt(unit.ammo2, 10);
		unit.fuel = Number.parseInt(unit.fuel, 10);
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
	 * Return all units from a Room.
	 * @param  {String} shortIdRoom - The shortid of the room.
	 * @return {Promise} A Promise with all units.
	 */
	static getAllUnitInRoom(shortIdRoom) {
		return new Promise((resolve, reject) => {
			const unitKeysWithCmd = [];
			const stream = this.redis.scanStream({
				match: RedisUnit.getKey(shortIdRoom),
			});

			stream.on('data', (keysResult) => {
				keysResult.forEach((key) => {
					unitKeysWithCmd.push(['hgetall', key]);
				});
			});

			stream.on('end', () => {
				if (unitKeysWithCmd.length === 0) {
					resolve([]);
					return;
				}

				this.redis.pipeline(unitKeysWithCmd)
					.exec()
					.then((result) => {
						const units = [];
						const errors = [];

						result.forEach((unit) => {
							if (unit[0] !== null) {
								errors.push(unit[0]);
							} else {
								units.push(RedisUnit.parseModel(unit[1]));
							}
						});
						if (errors.length) {
							reject(errors);
							return;
						}
						resolve(units);
					})
					.catch((error) => reject(error));
			});
		});
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
				match: RedisUnit.getKey(shortIdRoom, idPlayer),
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
}

module.exports = RedisUnit;
