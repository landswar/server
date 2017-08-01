const logger = require('winston-lludol');
const test = require('ava');
const LandsWarDatabase = require('../src/models/LandsWarDatabase');

test.before(async () => {
	global.logger = logger;
	return LandsWarDatabase.create();
});
