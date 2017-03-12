const knex = require('knex')({
	client:     'mysql',
	connection: {
		host:     '127.0.0.1',
		user:     'landswar',
		password: 'landswar',
		database: 'landswar',
		charset:  'utf8',
	},
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
