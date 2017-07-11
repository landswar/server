const Boom = require('boom');

const Map = require('../../models/map');

/* eslint-disable valid-jsdoc */

/**
 * @api {get} /maps Request every Map.
 * @apiName getMaps
 * @apiGroup Map
 *
 * @apiSuccess (200) {Object[]} maps List of Maps.
 * @apiSuccess (200) {Number} maps.id Maps unique ID.
 * @apiSuccess (200) {String} maps.name Name of the map.
 * @apiSuccess (200) {Number} maps.data A JSON which follow the JSON Map format.
 */
exports.getMaps = async function (request, reply) {
	try {
		const maps = await Map.getAll();

		reply(maps);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};
