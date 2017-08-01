const test = require('ava');
const Promise = require('bluebird');

global.Promise = Promise;

require('./before');

const LandsWarDatabase = require('../src/models/LandsWarDatabase');
const MapPlugin = require('../src/routes/map/index');
const Helper = require('./Helper');

const helper = new Helper();

test.before(() =>
	helper.registerPlugins([MapPlugin])
);

test('/maps GET get every maps', (t) =>
	helper.server.inject(helper.getOptions('GET', '/maps')).then((res) =>
		t.deepEqual(res.result.length, LandsWarDatabase.MAPS.length)
	)
);

test('/maps/:id GET get map :id', (t) =>
	helper.server.inject(helper.getOptions('GET', '/maps/1'))
    .then((res) => t.deepEqual(res.statusCode, 200))
);
