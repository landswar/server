const bookshelf = require('./bookshelf');
const Base = require('./Base');
const Friend = require('./friend');

const Player = bookshelf.Model.extend({
	tableName: 'players',

	friends() {
		console.log('friends in Player');
		return this.belongsToMany(Player)
			.through(Friend, 'friend_id', 'user_id')
			.query((qb) => {
				qb.whereRaw(
                     `exists(
                         select 1
                         from friends f
                         where f.friend_id = friends.user_id
                         and f.user_id = friends.friend_id )`
                );
			});
	},
});

module.exports = new Base(Player);
