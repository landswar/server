const env = process.env.NODE_ENV || 'development';

const knex = require('knex')({
	client:     'mysql',
	connection: {
		host:     '127.0.0.1',
		user:     'landswar',
		password: 'landswar',
		database: env === 'test' ? 'landswar_test' : 'landswar',
		charset:  'utf8',
	},
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
