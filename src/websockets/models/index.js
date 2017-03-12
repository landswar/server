const redisPlayer = require('./redisPlayer');
const redisRoom = require('./redisRoom');

const after = function (server, next) {
	const bind = {
		bind: {
			redis: server.app.redis,
			lib:   server.methods.lib,
		},
	};

	/* Room */
	server.method('redis.room.create', redisRoom.create, bind);
	server.method('redis.room.get', redisRoom.get, bind);
	server.method('redis.room.setValues', redisRoom.setValues, bind);

	/* Player */
	server.method('redis.player.create', redisPlayer.create, bind);
	server.method('redis.player.get', redisPlayer.getAllPlayerInRoom, bind);
	server.method('redis.player.exists', redisPlayer.exists, bind);

	return next();
};

exports.register = function (server, options, next) {
	server.dependency('hapi-ioredis', after);

	next();
};

exports.register.attributes = {
	name:    'redis.models',
	version: '0.0.1',
};
