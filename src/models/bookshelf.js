const env = process.env.NODE_ENV || 'development';

const knex = require('knex')({
	client:     'mysql',
	connection: {
		host:     process.env.DB_HOST || '127.0.0.1',
		user:     process.env.DB_USER || 'landswar',
		password: process.env.DB_PASSWORD || 'landswar',
		database: env === 'test' ? 'landswar_test' : (process.env.DB_DATABASE || 'landswar'),
		charset:  'utf8',
	},
	useNullAsDefault: true,
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
