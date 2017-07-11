const logger = require('winston-lludol');

const LandsWarDatabase = require('../src/models/LandsWarDatabase');

global.logger = logger;

LandsWarDatabase.create()
.then(() => {
	logger.info('Database created');
	process.exit(0);
})
.catch((error) => {
	logger.error(error.message ? error.message : error);
	process.exit(1);
});
