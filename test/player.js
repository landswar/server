const test = require('ava');
const Promise = require('bluebird');

global.Promise = Promise;

require('./before');

const PlayerPlugin = require('../src/routes/player/index');
const UtilsPlugin = require('../src/utils/index');
const JwtPlugin = require('hapi-auth-jwt');
const Helper = require('./Helper');

const helper = new Helper();

const playerTestRaw = {
	nickname: 'test',
	email:    'test@mail.com',
	password: 'test',
};

// playerTest is the playerTestRaw returned by the API when created
let playerTest;
// token of playerTest returned by the API when created
let token;

test.before(() =>
	helper.registerPlugins([PlayerPlugin, JwtPlugin, UtilsPlugin])
);

test('/players POST create new player', (t) =>
	helper.server.inject(helper.getOptions('POST', '/players', undefined, playerTestRaw))
	.then((res) => {
		token = res.result.token;
		t.deepEqual({
			nickname: res.result.nickname,
			email:    res.result.email,
		}, {
			nickname: playerTestRaw.nickname,
			email:    playerTestRaw.email,
		});
		playerTest = res.result;
	})
);

test('/players POST create player with nickname already used', (t) =>
	helper.server.inject(helper.getOptions('POST', '/players', undefined, playerTestRaw))
	.then((res) => {
		t.deepEqual(res.statusCode, 400);
	})
);

test('/players GET every players', (t) =>
	helper.server.inject(helper.getOptions('GET', '/players', token))
	.then((res) => t.deepEqual(res.result.length, 1))
);

test('/players/:id GET specific player', (t) =>
	helper.server.inject(helper.getOptions('GET', `/players/${playerTest.id}`, token))
	.then((res) => {
		t.deepEqual(res.result, {
			id:       playerTest.id,
			nickname: playerTest.nickname,
			email:    playerTest.email,
		});
	})
);

test('/players/:id PUT update player :id', (t) => {
	const nickname = 'nickname updated';
	return helper.server.inject(helper.getOptions('PUT', `/players/${playerTest.id}`, token, { nickname }))
	.then((res) => {
		t.deepEqual(res.result.nickname, nickname);
	});
});

test('/players/:id DELETE delete player :id', (t) =>
	helper.server.inject(helper.getOptions('DELETE', `/players/${playerTest.id}`, token))
	.then((res) => {
		t.deepEqual(res.statusCode, 200);
	})
);
