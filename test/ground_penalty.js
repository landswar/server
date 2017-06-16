const Boom = require('boom');
const camelCaseKeys = require('camelcase-keys');
const Promise = require('bluebird');
const test = require('ava');

global.Promise = Promise;

require('./before');

const GroundPenaltyPlugin = require('../src/routes/ground_penalty/index');
const Helper = require('./Helper');
const LandsWarDatabase = require('../src/models/LandsWarDatabase');
const LandsWarLib = require('../src/utils/LandsWarLib');

const helper = new Helper();

test.before(() =>
	LandsWarDatabase.createGrounds().then(() =>
		LandsWarDatabase.createGroundPenalties().then(() => {
			helper.registerPlugins([GroundPenaltyPlugin]);
		})
	)
);

test('/groundPenalties GET', (t) =>
	helper.server.inject('/groundPenalties').then((res) => {
		t.deepEqual(res.result, LandsWarLib.camelCaseArray(LandsWarDatabase.GROUND_PENALTIES));
	})
);

test('/groundPenalties/1/1 GET', (t) =>
	helper.server.inject('/groundPenalties/1/1').then((res) => {
		t.deepEqual(res.result, camelCaseKeys(LandsWarDatabase.GROUND_PENALTIES[0]));
	})
);

test('/groundPenalties/1337/1337 GET => 404', (t) =>
	helper.server.inject('/groundPenalties/1337/1337').then((res) => {
		t.deepEqual(res.result, Boom.notFound().output.payload);
	})
);
