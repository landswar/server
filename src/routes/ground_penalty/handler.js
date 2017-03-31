const Boom = require('boom');
const GroundPenalty = require('./../models/ground_penalty');

/* eslint-disable valid-jsdoc */

/**
 * @api {get} /groundPenalties Request every GroundPenalty.
 * @apiName getGroundPenalties
 * @apiGroup GroundPenalty
 *
 * @apiSuccess (200) {Object[]} groundPenalties List of GroundPenalties.
 * @apiSuccess (200) {Number} groundPenalties.id GroundPenalties unique ID.
 * @apiSuccess (200) {String} groundPenalties.idGround Grounds unique ID.
 * @apiSuccess (200) {Number} groundPenalties.idUnit Units unique ID.
 * @apiSuccess (200) {Number} groundPenalties.penalty Penalty of Ground for the Unit.
 */
exports.getGroundPenalties = async function (request, reply) {
	try {
		const groundPenalties = await GroundPenalty.getAll();
		reply(groundPenalties);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {get} /groundPenalty/:idUnit/:idGround Request GroundPenalty information.
 * @apiName getGroundPenalty
 * @apiGroup GroundPenalty
 *
 * @apiParam {Number} idUnit Units unique ID.
 * @apiParam {Number} idGround Grounds unique ID.
 *
 * @apiSuccess (200) {Number} id GroundPenalties unique ID.
 * @apiSuccess (200) {String} idGround Grounds unique ID.
 * @apiSuccess (200) {Number} idUnit Units unique ID.
 * @apiSuccess (200) {Number} penalty Penalty of Ground for the Unit.
 *
 * @apiError (404) GroundPenaltyNotFound The id of the GroundPenalty was not found.
 */
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
		reply(Boom.badImplementation());
	}
};
