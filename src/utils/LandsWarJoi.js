const Joi = require('joi');
const LandsWarError = require('./LandsWarError').LandsWarError;

const defaultSchema = {
	tokenPlayer: Joi.string().required(),
	shortIdRoom: Joi.string().min(7).max(14).required(),
};

/**
 * Joi wrapper for LandsWar.
 */
class LandsWarJoi {
	/**
	 * Validate datas.
	 * @param {Object} data - Value(s) to be validated.
	 * @param {Joi.Object} schema - The schema
	 * @return {Promise} - Return a Promise with validated datas.
	 */
	static validate(data, schema) {
		return new Promise((resolve, reject) => {
			Joi.validate(data, schema, { abortEarly: false }, (error, values) => {
				if (error) {
					error.message = error.details.map((elem) => elem.message).join('\n');
					reject(error);
				} else {
					resolve(values);
				}
			});
		});
	}

	/**
	 * Return every schema associated with keys.
	 * @param {Array} keys - An array of schema keys.
	 * @return {Object} The Joi schema Object.
	 */
	static getSchema(keys) {
		const schema = {};

		keys.forEach((value) => {
			if (!defaultSchema.hasOwnProperty(value)) {
				throw new LandsWarError(`Invalid key name: ${value}`);
			}
			Object.assign(schema, {
				[value]: defaultSchema[value],
			});
		});

		return Joi.object(schema);
	}
}

module.exports = LandsWarJoi;
