const Boom = require('boom');
const test = require('ava');
const Promise = require('bluebird');

global.Promise = Promise;

require('./before');

const GroundPlugin = require('../src/routes/ground/index');
const Helper = require('./Helper');
const LandsWarDatabase = require('../src/models/LandsWarDatabase');

const helper = new Helper();

test.before(() =>
//	LandsWarDatabase.createGrounds(true).then(() => {
		helper.registerPlugins([GroundPlugin])
//	})
);

test('/grounds GET', (t) =>
	helper.server.inject('/grounds').then((res) => {
		t.deepEqual(res.result, LandsWarDatabase.GROUNDS);
	})
);

test('/grounds/1 GET', (t) =>
	helper.server.inject('/grounds/1').then((res) => {
		t.deepEqual(res.result, LandsWarDatabase.GROUNDS[0]);
	})
);

test('/grounds/1337 GET => 404', (t) =>
	helper.server.inject('/grounds/1337').then((res) => {
		t.deepEqual(res.result, Boom.notFound().output.payload);
	})
);
