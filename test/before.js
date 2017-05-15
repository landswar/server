const logger = require('winston-lludol');
const test = require('ava');

test.before(() => {
	global.logger = logger;
});
