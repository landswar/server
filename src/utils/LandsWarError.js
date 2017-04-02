const Boom = require('boom');

/**
 * Handle Error.
 */
class LandsWarError extends Error {
	/**
	 * Define name of the error and set the message.
	 * @param {String} message - The message.
	 */
	constructor(message) {
		super(message);

		this.name = 'LandsWarError';
	}
}

/**
 * Handle error for every socket.
 * @param {Error} error - The error Object.
 * @param {Function} callback - The socket callback function.
 */
function handleSocketError(error, callback) {
	if ((error.name === undefined || error.name === 'ValidationError' || error.name === 'LandsWarError') && error.message) {
		logger.error(error.message);
		callback(Boom.badRequest(error.message));
	} else {
		logger.error(error);
		callback(Boom.badImplementation());
	}
}

module.exports = {
	LandsWarError,
	handleSocketError,
};
