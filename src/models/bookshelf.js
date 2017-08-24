const env = process.env.NODE_ENV || 'development';

const knex = require('knex')({
	client:           'mysql',
	connection:       process.env.MYSQL_URL || `mysql://landswar:landswar@127.0.0.1:3306/${env === 'test' ? 'landswar_test' : 'landswar'}`,
	useNullAsDefault: true,
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
