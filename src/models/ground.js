const bookshelf = require('./bookshelf');
const Base = require('./Base');

const Ground = bookshelf.Model.extend({
	tableName: 'grounds',
});

module.exports = new Base(Ground);
