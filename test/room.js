/*
const test = require('ava');
const Promise = require('bluebird');

global.Promise = Promise;

require('./before');

const PlayerPlugin = require('../src/routes/player/index');
const RoomPlugin = require('../src/routes/room/index');
const RedisPlugin = require('../src/websockets/models/index');
const RedisRoomPlugin = require('../src/websockets/room/index');
const UtilsPlugin = require('../src/utils/index');
const AuthPlugin = require('hapi-auth-jwt');
const Helper = require('./Helper');

const helper = new Helper();

// playerTest will be the player returned by the API when created
let playerTest = {
	nickname: 'test',
	email:    'test@mail.com',
	password: 'test',
};
// token of playerTest returned by the API when created
let token;

const roomTestRaw = {
	name:  'roomTest',
	idMap: 1,
};
// roomTest is the room returned by the API when roomTestRaw is created
let roomTest;

test.before(async () => {
	// TODO: regler le probleme des plugin redis (cf: line 98 route/room/handler.js)
	// cannot read property room of undefined => await request.server.methods.redis.room.create(room, map);
	const plugins = [AuthPlugin, UtilsPlugin, RedisPlugin, RedisRoomPlugin, PlayerPlugin, RoomPlugin];
	helper.registerPlugins(plugins);
	const res = await helper.server.inject(helper.getOptions('POST', '/players', undefined, playerTest));
	token = res.result.token;
	playerTest = res.result;
});

test('/rooms POST create new room', (t) => {
	return helper.server.inject(helper.getOptions('POST', '/rooms', token, roomTestRaw))
	.then((res) => {
		t.deepEqual(
			{ name: res.result.name },
			{ name: roomTestRaw.name }
		);
		roomTest = res.result;
	})
});

*/
