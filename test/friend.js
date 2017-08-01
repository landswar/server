const test = require('ava');
const Promise = require('bluebird');

global.Promise = Promise;

require('./before');

const PlayerPlugin = require('../src/routes/player/index');
const FriendPlugin = require('../src/routes/friend/index');
const UtilsPlugin = require('../src/utils/index');
const JwtPlugin = require('hapi-auth-jwt');
const Helper = require('./Helper');

const helper = new Helper();

let playerTest1 = {
	nickname: 'test1',
	email:    'test1@mail.com',
	password: 'test1',
};
let playerTest2 = {
	nickname: 'test2',
	email:    'test2@mail.com',
	password: 'test2',
};

test.before(async () => {
	helper.registerPlugins([PlayerPlugin, FriendPlugin, JwtPlugin, UtilsPlugin]);
	playerTest1 = (await helper.server.inject(helper.getOptions('POST', '/players', undefined, playerTest1))).result;
	playerTest2 = (await helper.server.inject(helper.getOptions('POST', '/players', undefined, playerTest2))).result;
});

test('/friends POST player1 request himself as friend (bad request)', (t) =>
	helper.server.inject(helper.getOptions('POST', '/friends', playerTest1.token, { friend_id: playerTest1.id }))
    .then((res) => t.deepEqual(res.statusCode, 400))
);

test('/friends POST player1 request player2 as friend', (t) =>
	helper.server.inject(helper.getOptions('POST', '/friends', playerTest1.token, { friend_id: playerTest2.id }))
    .then((res) => t.deepEqual(res.statusCode, 200))
);

test('/friendsRequest GET friend request of player2 (should be 1)', (t) =>
	helper.server.inject(helper.getOptions('GET', '/friendsRequest', playerTest2.token))
    .then((res) => t.deepEqual(res.result.length, 1))
);

test('/friendsRequest GET friends of player2 (should be 0)', (t) =>
	helper.server.inject(helper.getOptions('GET', '/friends', playerTest2.token))
    .then((res) => t.deepEqual(res.result.length, 0))
);

test('/friends POST player2 accept player1 as friend', (t) =>
	helper.server.inject(helper.getOptions('POST', '/friends', playerTest2.token, { friend_id: playerTest1.id }))
    .then((res) => t.deepEqual(res.statusCode, 200))
);

test('/friendsRequest GET friends of player2 (should be 1)', (t) =>
	helper.server.inject(helper.getOptions('GET', '/friends', playerTest2.token))
    .then((res) => t.deepEqual(res.result.length, 1))
);

test('/friends DELETE unexisting friend', (t) =>
	helper.server.inject(helper.getOptions('DELETE', '/friends/150', playerTest2.token))
    .then((res) => t.deepEqual(res.statusCode, 400))
);

test('/friends DELETE friend of player2 (player1)', (t) =>
	helper.server.inject(helper.getOptions('DELETE', `/friends/${playerTest1.id}`, playerTest2.token))
    .then((res) => t.deepEqual(res.statusCode, 200))
);

test.after(async () => {
	await helper.server.inject(helper.getOptions('DELETE', `/players/${playerTest1.id}`, undefined));
	await helper.server.inject(helper.getOptions('DELETE', `/players/${playerTest2.id}`, undefined));
});
