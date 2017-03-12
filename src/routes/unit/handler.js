const Boom = require('boom');
const Unit = require('./../models/unit');

exports.getUnits = async function (request, reply) {
	try {
		const units = await Unit.getAll();
		reply(units);
	} catch (error) {
		logger.error(error);
		reply(error);
	}
};

exports.getUnit = async function (request, reply) {
	try {
		const unit = await Unit.get(request.params.id);
		if (!unit) {
			reply(Boom.notFound());
			return;
		}
		reply(unit);
	} catch (error) {
		logger.error(error);
		reply(error);
	}
};

