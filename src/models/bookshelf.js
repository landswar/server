const env = process.env.NODE_ENV || 'development';
let databaseUrl = process.env.MYSQL_URL || `mysql://landswar:landswar@127.0.0.1:3306/${env === 'test' ? 'landswar_test' : 'landswar'}`;

if (process.env.TRAVIS === 'true') {
	databaseUrl = 'mysql://root@127.0.0.1:3306/landswar_test';
}

const knex = require('knex')({
	client:           'mysql',
	connection:       databaseUrl,
	useNullAsDefault: true,
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
