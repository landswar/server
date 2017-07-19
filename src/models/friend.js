const bookshelf = require('./bookshelf');
const Base = require('./Base');
const Player = require('./player');

const Friend = bookshelf.Model.extend({
	tableName: 'friends',

	user() {
		console.log('user in Friend');
		return this.belongsTo(Player);
	},

	friend() {
		console.log('friend in Friend');
		return this.belongsTo(Player, 'friend_id');
	},
});

module.exports = new Base(Friend);
