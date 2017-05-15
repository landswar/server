const Boom = require('boom');
const Ground = require('../../models/ground');

/* eslint-disable valid-jsdoc */

/**
 * @api {get} /grounds Request every Ground.
 * @apiName getGrounds
 * @apiGroup Ground
 *
 * @apiSuccess (200) {Object[]} grounds List of Grounds.
 * @apiSuccess (200) {Number} grounds.id Grounds unique ID.
 * @apiSuccess (200) {String} grounds.name Name of the ground.
 * @apiSuccess (200) {Number} grounds.defense Defense of the ground.
 */
exports.getGrounds = async function (request, reply) {
	try {
		const units = await Ground.getAll();
		reply(units);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {get} /ground/:id Request Ground information.
 * @apiName getGround
 * @apiGroup Ground
 *
 * @apiParam {Number} id Grounds unique ID.
 *
 * @apiSuccess (200) {Number} id Grounds unique ID.
 * @apiSuccess (200) {String} name Name of the ground.
 * @apiSuccess (200) {Number} defense Defense of the ground.
 *
 * @apiError (404) GroundNotFound The id of the Ground was not found.
 */
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
		reply(Boom.badImplementation());
	}
};
