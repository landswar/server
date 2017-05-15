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
		]);
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
}

module.exports = LandsWarDatabase;
