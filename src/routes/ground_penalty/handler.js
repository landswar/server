const Boom = require('boom');
const GroundPenalty = require('./../models/ground_penalty');

exports.getGroundPenalties = async function (request, reply) {
	try {
		const groundPenalties = await GroundPenalty.getAll();
		reply(groundPenalties);
	} catch (error) {
		logger.error(error);
		reply(error);
	}
};

exports.getGroundPenalty = async function (request, reply) {
	try {
		const groundPenalty = await GroundPenalty.get({
			id_unit:   request.params.idUnit,
			id_ground: request.params.idGround,
		});

		if (!groundPenalty) {
			reply(Boom.notFound());
			return;
		}

		reply(groundPenalty);
	} catch (error) {
		logger.error(error);
		reply(error);
	}
};
