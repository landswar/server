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
			LandsWarDatabase.dropTable('ground_penalties'),
			LandsWarDatabase.dropTable('rooms'),
		]).then(() => Promise.all([
			LandsWarDatabase.createGrounds(true),
			LandsWarDatabase.createMaps(true),
			LandsWarDatabase.createPlayers(true),
			LandsWarDatabase.createUnits(true),
		])).then(() =>
			Promise.all([
				LandsWarDatabase.createGroundPenalties(),
				LandsWarDatabase.createRooms(false),
				LandsWarDatabase.createFriends(true),
			])
		);
	}

	/**
	 * Drop a table.
	 * @param {String} name - The name of the table.
	 * @return {Promie} A Promise.
	 */
	static dropTable(name) {
		return Bookshelf.knex.schema
			.dropTableIfExists(name);
	}

	/**
	 * Create the grounds table.
	 * @param {Boolean} drop - True to drop the table before create it.
	 * @return {Promise} A Promise.
	 */
	static createGrounds(drop = false) {
		const dropExec = drop ? LandsWarDatabase.dropTable('grounds') : Bookshelf.knex.schema;
		return dropExec
		.createTable('grounds', (table) => {
			table.increments();
			table.string('name');
			table.integer('defense');
		}).then(() =>
			Bookshelf.knex('grounds').insert(LandsWarDatabase.GROUNDS)
		).then(() => {
			logger.info('Table grounds created');
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
	 * @param {Boolean} drop - True to drop the table before create it.
	 * @return {Promise} A Promise.
	 */
	static createGroundPenalties(drop = false) {
		const dropExec = drop ? LandsWarDatabase.dropTable('ground_penalties') : Bookshelf.knex.schema;
		return dropExec
		.createTable('ground_penalties', (table) => {
			table.increments();
			table.integer('id_ground').unsigned().references('id').inTable('grounds');
			table.integer('id_unit').unsigned().references('id').inTable('units');
			table.integer('penalty');
		}).then(() =>
			Bookshelf.knex('ground_penalties').insert(LandsWarDatabase.GROUND_PENALTIES)
		).then(() => {
			logger.info('Table ground_penalties created');
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
	 * @param {Boolean} drop - True to drop the table before create it.
	 * @return {Promise} A Promise.
	 */
	static createMaps(drop = false) {
		const dropExec = drop ? LandsWarDatabase.dropTable('maps') : Bookshelf.knex.schema;
		return dropExec
		.createTable('maps', (table) => {
			table.increments();
			table.string('name');
			table.json('data');
		}).then(() => {
			logger.info('Table maps created');
		});
	}

	/**
	 * Create the players table.
	 * @param {Boolean} drop - True to drop the table before create it.
	 * @return {Promise} A Promise.
	 */
	static createPlayers(drop = false) {
		const dropExec = drop ? LandsWarDatabase.dropTable('players') : Bookshelf.knex.schema;
		return dropExec
		.createTable('players', (table) => {
			table.increments();
			table.string('nickname');
			table.string('password');
			table.string('email');
		}).then(() => {
			logger.info('Table players created');
		});
	}

	/**
	 * Create the players table.
	 * @param {Boolean} drop - True to drop the table before create it.
	 * @return {Promise} A Promise.
	 */
	static createFriends(drop = false) {
		const dropExec = drop ? LandsWarDatabase.dropTable('friends') : Bookshelf.knex.schema;
		return dropExec
		.createTable('friends', (table) => {
			table.increments();
			table.integer('user_id').unsigned().references('id').inTable('players');
			table.integer('friend_id').unsigned().references('id').inTable('players');
		}).then(() => {
			logger.info('Table friends created');
		});
	}

	/**
	 * Create the rooms table.
	 * @param {Boolean} drop - True to drop the table before create it.
	 * @return {Promise} A Promise.
	 */
	static createRooms(drop = false) {
		const dropExec = drop ? LandsWarDatabase.dropTable('rooms') : Bookshelf.knex.schema;
		return dropExec
		.createTable('rooms', (table) => {
			table.increments();
			table.string('name');
			table.integer('max_player');
			table.string('shortid');
			table.integer('owner').unsigned().references('id').inTable('players');
		}).then(() => {
			logger.info('Table rooms created');
		});
	}

	/**
	 * Create the units table.
	 * @param {Boolean} drop - True to drop the table before create it.
	 * @return {Promise} A Promise.
	 */
	static createUnits(drop = false) {
		const dropExec = drop ? LandsWarDatabase.dropTable('units') : Bookshelf.knex.schema;
		return dropExec
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
			logger.info('Table units created');
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
