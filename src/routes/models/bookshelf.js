const knex = require('knex')({
	client:     'mysql',
	connection: {
		host:     '127.0.0.1',
		user:     'landswar',
		password: process.env.DATABASE_PASSWORD || 'landswar',
		database: process.env.DATABASE || 'landswar',
		charset:  'utf8',
	},
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
