const bookshelf = require('./bookshelf');
const Base = require('./Base');

const Unit = bookshelf.Model.extend({
	tableName: 'units',
});

module.exports = new Base(Unit);
