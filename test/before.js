const logger = require('winston-lludol');
const test = require('ava');
const LandsWarDatabase = require('../src/models/LandsWarDatabase');

test.before(() => {
	global.logger = logger;
	return LandsWarDatabase.create();
});
