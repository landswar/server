const Boom = require('boom');
const Ground = require('./../models/ground');

exports.getGrounds = async function (request, reply) {
	try {
		const units = await Ground.getAll();
		reply(units);
	} catch (error) {
		logger.error(error);
		reply(error);
	}
};

exports.getGround = async function (request, reply) {
	try {
		const ground = await Ground.get(request.params.id);
		if (!ground) {
			reply(Boom.notFound());
			return;
		}
		reply(ground);
	} catch (error) {
		logger.error(error);
		reply(error);
	}
};
