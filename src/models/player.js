const bookshelf = require('./bookshelf');
const Base = require('./Base');
const Friend = require('./friend');

const Player = bookshelf.Model.extend({
	tableName: 'players',

	friends() {
		const query = (qb) => {
			qb.whereRaw('exists(select 1 from friends f where f.friend_id = friends.user_id and f.user_id = friends.friend_id)');
		};
		return this.belongsToMany(Player).through(Friend._Model, 'friend_id', 'user_id')
            .query(query);
	},

	friendsRequest() {
		const query = (qb) => {
			qb.whereRaw('not exists(select 1 from friends f where f.friend_id = friends.user_id and f.user_id = friends.friend_id)');
		};

		return this.belongsToMany(Player).through(Friend._Model, 'friend_id', 'user_id')
            .query(query);
	},
});

module.exports = new Base(Player);
