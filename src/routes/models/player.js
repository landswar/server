const bookshelf = require('./bookshelf');
const Base = require('./Base');

const Player = bookshelf.Model.extend({
	tableName: 'players',
});

module.exports = new Base(Player);
