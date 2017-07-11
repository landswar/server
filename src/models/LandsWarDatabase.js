const Bookshelf = require('./bookshelf');

/**
 * Class which create tables and insert default values to the LandsWar database.
 */
class LandsWarDatabase {
	/**
	 * Create all tables.
	 * @return {Promise} A Promise.
	 */
	static create() {
		return Promise.all([
			LandsWarDatabase.createGrounds(),
			LandsWarDatabase.createMaps(),
			LandsWarDatabase.createPlayers(),
			LandsWarDatabase.createRooms(),
			LandsWarDatabase.createUnits(),
		]).then(() =>
			Promise.all([
				LandsWarDatabase.createGroundPenalties(),
			])
		);
	}

	/**
	 * Create the grounds table.
	 * @return {Promise} A Promise.
	 */
	static createGrounds() {
		return Bookshelf.knex.schema
		.dropTableIfExists('grounds')
		.createTable('grounds', (table) => {
			table.increments();
			table.string('name');
			table.integer('defense');
		}).then(() =>
			Bookshelf.knex('grounds').insert(LandsWarDatabase.GROUNDS)
		).then(() => {
			logger.info('Database grounds created');
		});
	}

	/**
	 * Default grounds.
	 * @return {Array} An array of Ground (id, name and defanse).
	 */
	static get GROUNDS() {
		return [
			{ id: 1, name: 'plain', defense: 1 },
			{ id: 2, name: 'wood', defense: 2 },
			{ id: 3, name: 'mountain', defense: 4 },
			{ id: 4, name: 'road', defense: 1 },
		];
	}

	/**
	 * Create the ground_penalties table.
	 * @return {Promise} A Promise.
	 */
	static createGroundPenalties() {
		return Bookshelf.knex.schema
		.dropTableIfExists('ground_penalties')
		.createTable('ground_penalties', (table) => {
			table.increments();
			table.integer('id_ground');
			table.integer('id_unit');
			table.integer('penalty');
		}).then(() =>
			Bookshelf.knex('ground_penalties').insert(LandsWarDatabase.GROUND_PENALTIES)
		).then(() => {
			logger.info('Database ground_penalties created');
		});
	}

	/**
	 * Default ground_penalties.
	 * @return {Array} An array of GroundPenalty (id, id_ground, id_unit and penalty).
	 */
	static get GROUND_PENALTIES() {
		return [
			{ id: 1, id_ground: 1, id_unit: 1, penalty: 1 },
			{ id: 2, id_ground: 2, id_unit: 1, penalty: 1 },
			{ id: 3, id_ground: 3, id_unit: 1, penalty: 2 },
			{ id: 4, id_ground: 4, id_unit: 1, penalty: 1 },
		];
	}

	/**
	 * Create the maps table.
	 * @return {Promise} A Promise.
	 */
	static createMaps() {
		return Bookshelf.knex.schema
		.dropTableIfExists('maps')
		.createTable('maps', (table) => {
			table.increments();
			table.string('name');
			table.json('data');
		}).then(() => {
			logger.info('Database maps created');
		});
	}

	/**
	 * Create the players table.
	 * @return {Promise} A Promise.
	 */
	static createPlayers() {
		return Bookshelf.knex.schema
		.dropTableIfExists('players')
		.createTable('maps', (table) => {
			table.increments();
			table.string('nickname');
		}).then(() => {
			logger.info('Database players created');
		});
	}

	/**
	 * Create the rooms table.
	 * @return {Promise} A Promise.
	 */
	static createRooms() {
		return Bookshelf.knex.schema
		.dropTableIfExists('rooms')
		.createTable('rooms', (table) => {
			table.increments();
			table.string('name');
			table.integer('max_player');
			table.string('shortid');
			table.integer('owner');
		}).then(() => {
			logger.info('Database rooms created');
		});
	}

	/**
	 * Create the units table.
	 * @return {Promise} A Promise.
	 */
	static createUnits() {
		return Bookshelf.knex.schema
		.dropTableIfExists('units')
		.createTable('units', (table) => {
			table.increments();
			table.string('name');
			table.integer('life');
			table.integer('ammo1');
			table.integer('ammo2').nullable();
			table.integer('fuel');
			table.integer('vision');
			table.integer('move');
			table.integer('rangeMin');
			table.integer('rangeMax');
			table.integer('cost');
		}).then(() =>
			Bookshelf.knex('units').insert(LandsWarDatabase.UNITS)
		).then(() => {
			logger.info('Database units created');
		});
	}

	/**
	 * Default units.
	 * @return {Array} An array of Unit (id, name, life, ammo1, ammo2, fuel,
	 *                 vision, move, rangeMin, rangeMax, cost).
	 */
	static get UNITS() {
		return [
			{ id: 1, name: 'infantry', life: 10, ammo1: 99, ammo2: null, fuel: 99, vision: 2, move: 3, rangeMin: 1, rangeMax: 1, cost: 1000 },
		];
	}
}

module.exports = LandsWarDatabase;
