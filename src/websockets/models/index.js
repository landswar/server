const redisRoom = require('./redisRoom');
const redisPlayer = require('./redisPlayer');
const redisUnit = require('./redisUnit');

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

	/* Unit */
	server.method('redis.unit.create', redisUnit.create, bind);
	server.method('redis.unit.remove', redisUnit.remove, bind);
	server.method('redis.unit.get', redisUnit.get, bind);

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
