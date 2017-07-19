const bookshelf = require('./bookshelf');
const Base = require('./Base');
const Friend = require('./friend');

const Player = bookshelf.Model.extend({
	tableName: 'players',

	friends() {
		return this.belongsToMany(Player).through(Friend._Model, 'friend_id', 'user_id');
	},
});

module.exports = new Base(Player);
