const mysqlConfig = {
	client:     'mysql',
	connection: {
		host:     '127.0.0.1',
		user:     'landswar',
		password: process.env.DATABASE_PASSWORD || 'landswar',
		database: process.env.DATABASE || 'landswar',
		charset:  'utf8',
	},
};

const sqliteConfig = {
	client:     'sqlite3',
	connection: {
		filename: ':memory:',
	},
	useNullAsDefault: true,
};

const knex = require('knex')(process.env.NODE_ENV === 'test' ? sqliteConfig : mysqlConfig);

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
