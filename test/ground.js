const test = require('ava');

const GroundPlugin = require('../src/routes/ground/index');
const Helper = require('./Helper');
const LandsWarDatabase = require('../src/models/LandsWarDatabase');

require('./before');

const helper = new Helper();

test.before(() =>
	LandsWarDatabase.createGrounds().then(() => {
		helper.registerPlugins([GroundPlugin]);
	})
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
