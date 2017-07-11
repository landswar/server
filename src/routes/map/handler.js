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
 * @apiSuccess (200) {String} maps.name The name of the map.
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

/**
 * @api {get} /maps/:id Request a Map.
 * @apiName getMap
 * @apiGroup Map
 *
 * @apiSuccess (200) {Number} map.id Maps unique ID.
 * @apiSuccess (200) {String} map.name The name of the map.
 * @apiSuccess (200) {Number} map.data A JSON which follow the JSON Map format.
 */
exports.getMap = async function (request, reply) {
	try {
		const map = await Map.get({ id: request.params.id });

		if (!map) {
			reply(Boom.notFound());
			return;
		}

		reply(map);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

/**
 * @api {get} /maps/:id/preview Request the map preview.
 * @apiName getMapPreview
 * @apiGroup Map
 *
 * @apiSuccess (200) {Image} The PNG preview of the map.
 */
exports.getMapPreview = async function (request, reply) {
	try {
		const map = await Map.get({ id: request.params.id });

		if (!map) {
			reply(Boom.notFound());
			return;
		}

		reply.file(`map_previews/map_${map.id}.png`);
	} catch (error) {
		logger.error(error);
		reply(Boom.badImplementation());
	}
};

