const LandsWarError = require('./LandsWarError');
const LandsWarJoi = require('./LandsWarJoi');
const LandsWarLib = require('./LandsWarLib');

exports.register = function (server, options, next) {
	server.method('joi.validate', LandsWarJoi.validate);
	server.method('joi.getSchema', LandsWarJoi.getSchema);

	server.method('error.Custom', LandsWarError.LandsWarError);
	server.method('error.handleSocket', LandsWarError.handleSocketError);

	server.method('lib.isObjectEmpty', LandsWarLib.isObjectEmpty);
	server.method('lib.createToken', LandsWarLib.createToken);
	server.method('lib.verifyJwt', LandsWarLib.verifyJwt);
	server.method('lib.shuffleArray', LandsWarLib.shuffleArray);

	next();
};

exports.register.attributes = {
	name:    'utils',
	version: '0.0.1',
};
