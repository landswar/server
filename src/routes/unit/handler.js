const Boom = require('boom');
const Unit = require('./../models/unit');

/* eslint-disable valid-jsdoc */

/**
 * @api {get} /units Request every Unit.
 * @apiName getUnits
 * @apiGroup Unit
 *
 * @apiSuccess (200) {Object[]} units List of Units.
 * @apiSuccess (200) {Number} units.id Units unique ID.
 * @apiSuccess (200) {String} units.name Name of the unit.
 * @apiSuccess (200) {Number} units.life The total life of the Unit.
 * @apiSuccess (200) {Number} units.ammo1 The total of ammunition for the first weapon.
 * @apiSuccess (200) {Number} units.ammo2 The total of ammunition for the second weapon or null.
 * @apiSuccess (200) {Number} units.fuel The total of fuel for the unit.
 * @apiSuccess (200) {Number} units.vision The vision of the unit. The unit can see N box(es).
 * @apiSuccess (200) {Number} units.move The move of the unit. The unit can move N box(es).
 * Penalty will be added depending on the ground.
 * @apiSuccess (200) {Number} units.rangeMin The rangeMin of the unit.
 * The minimum target can be at N box(es).
 * @apiSuccess (200) {Number} units.rangeMax The rangeMax of the unit.
 * The maximum target can be at N box(es).
 * @apiSuccess (200) {Number} units.cost The cost of the unit.
 */
exports.getUnits = async function (request, reply) {
	try {
		const units = await Unit.getAll();
		reply(units);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};


/**
 * @api {get} /unit/:id Request Unit informations.
 * @apiName getUnit
 * @apiGroup Unit
 *
 * @apiParam {Number} id Units unique ID.
 *
 * @apiSuccess (200) {Number} id Units unique ID.
 * @apiSuccess (200) {String} name Name of the unit.
 * @apiSuccess (200) {Number} life The total life of the Unit.
 * @apiSuccess (200) {Number} ammo1 The total of ammunition for the first weapon.
 * @apiSuccess (200) {Number} ammo2 The total of ammunition for the second weapon or null.
 * @apiSuccess (200) {Number} fuel The total of fuel for the unit.
 * @apiSuccess (200) {Number} vision The vision of the unit. The unit can see N box(es).
 * @apiSuccess (200) {Number} move The move of the unit. The unit can move N box(es).
 * Penalty will be added depending on the ground.
 * @apiSuccess (200) {Number} rangeMin The rangeMin of the unit.
 * The minimum target can be at N box(es).
 * @apiSuccess (200) {Number} rangeMax The rangeMax of the unit.
 * The maximum target can be at N box(es).
 * @apiSuccess (200) {Number} cost The cost of the unit.
 *
 * @apiError (404) UnitNotFound The id of the Unit was not found.
 */
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
		reply(Boom.badImplementation());
	}
};

