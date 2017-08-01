const test = require('ava');
const Promise = require('bluebird');

global.Promise = Promise;

require('./before');

const PlayerPlugin = require('../src/routes/player/index');
const AuthPlugin = require('../src/routes/auth/index');
const UtilsPlugin = require('../src/utils/index');
const JwtPlugin = require('hapi-auth-jwt');
const Helper = require('./Helper');

const helper = new Helper();

const playerTestRaw = {
	nickname: 'test',
	email:    'test@mail.com',
	password: 'test',
};
let playerTest;
let token;

test.before(async () => {
	helper.registerPlugins([PlayerPlugin, AuthPlugin, JwtPlugin, UtilsPlugin]);
	playerTest = (await helper.server.inject(helper.getOptions('POST', '/players', undefined, playerTestRaw))).result;
});

test('/login POST login with player test', (t) =>
	helper.server.inject(helper.getOptions('POST', '/login', undefined, {
		id:       playerTestRaw.nickname,
		password: playerTestRaw.password,
	})).then((res) => {
		token = res.result.token;
		t.deepEqual(res.statusCode, 200);
	})
);

test('/login POST login with wrong password', (t) =>
	helper.server.inject(helper.getOptions('POST', '/login', undefined, {
		id:       playerTestRaw.nickname,
		password: 'wrongpass',
	})).then((res) => {
		t.deepEqual(res.statusCode, 400);
	})
);

test('/login POST login with wrong nickname', (t) =>
	helper.server.inject(helper.getOptions('POST', '/login', undefined, {
		id:       'wrong',
		password: 'wrong',
	})).then((res) => {
		t.deepEqual(res.statusCode, 404);
	})
);

test('/checkToken POST check validity of player token', (t) =>
	helper.server.inject(helper.getOptions('POST', '/checkToken', undefined, { token }))
    .then((res) => t.deepEqual(res.statusCode, 200))
);

test.after(async () => {
	await helper.server.inject(helper.getOptions('DELETE', `/players/${playerTest.id}`, token));
});
