const bookshelf = require('./bookshelf');
const Base = require('./Base');
const Player = require('./player');

const Friend = bookshelf.Model.extend({
	tableName: 'friends',

	user() {
		return this.belongsTo(Player._Model);
	},

	friend() {
		return this.belongsTo(Player._Model, 'friend_id');
	},
});

module.exports = new Base(Friend);
