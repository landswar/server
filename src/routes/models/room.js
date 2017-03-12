const bookshelf = require('./bookshelf');
const Base = require('./Base');

const Room = bookshelf.Model.extend({
	tableName: 'rooms',
});

module.exports = new Base(Room);
