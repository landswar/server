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
			logger.info('Database grounds created');
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
}

module.exports = LandsWarDatabase;
