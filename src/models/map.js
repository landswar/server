const bookshelf = require('./bookshelf');
const Base = require('./Base');

const Map = bookshelf.Model.extend({
	tableName: 'maps',
});

module.exports = new Base(Map);
