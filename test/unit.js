const Boom = require('boom');
const test = require('ava');
const Promise = require('bluebird');

global.Promise = Promise;

require('./before');

const UnitPlugin = require('../src/routes/unit/index');
const Helper = require('./Helper');
const LandsWarDatabase = require('../src/models/LandsWarDatabase');

const helper = new Helper();

test.before(() =>
	LandsWarDatabase.createUnits().then(() => {
		helper.registerPlugins([UnitPlugin]);
	})
);

test('/units GET', (t) =>
	helper.server.inject('/units').then((res) => {
		t.deepEqual(res.result, LandsWarDatabase.UNITS);
	})
);

test('/units/1 GET', (t) =>
	helper.server.inject('/units/1').then((res) => {
		t.deepEqual(res.result, LandsWarDatabase.UNITS[0]);
	})
);

test('/units/1337 GET => 404', (t) =>
	helper.server.inject('/units/1337').then((res) => {
		t.deepEqual(res.result, Boom.notFound().output.payload);
	})
);
