const camelcaseKeys = require('camelcase-keys');

const LandsWarLib = require('../utils/LandsWarLib');

/**
 * Base class to every MySQL Model.
 */
class Base {
	/**
	 * Save the model instance.
	 * @param {Object} Model - The model instance.
	 */
	constructor(Model) {
		this._Model = Model;
	}

	/**
	 * Insert an element to the database.
	 * @param {Object} attrs - Attributes with values of the element.
	 * @return {Promise} A Promise with the new element inserted.
	 */
	create(attrs) {
		return this._toJSON(new this._Model(attrs).save());
	}

	/**
	 * Insert multiple element to the database.
	 * @param {Array} elements - An array of element Object.
	 * @return {Promise} A Promise with an array of inserted elements.
	 */
	createAll(elements) {
		const promises = [];
		elements.forEach((element) => {
			promises.push(this.create(element));
		});
		return Promise.all(promises);
	}

	/**
	 * Update an element to the database.
	 * @param {Object} idOrAttrs - A number for an ID and an Object for different attributes.
	 * @param {Object} attrs - Attributes of the element to update.
	 * @return {Promise} A Promise with the element updated.
	 */
	update(idOrAttrs, attrs) {
		if (typeof idOrAttrs === 'number') {
			idOrAttrs = { id: idOrAttrs };
		}
		return this._Model.where(idOrAttrs).fetch().then((ret) => {
			const keys = Object.keys(attrs);
			for (let i = 0; i < keys.length; i++) {
				ret.attributes[keys[i]] = attrs[keys[i]];
			}
			return this._toJSON(ret.save());
		});
	}

	/**
	 * Delete an element from the database.
	 * @param {Object} idOrAttrs - A number for an ID and an Object for different attributes.
	 * @return {Promise} A Promise with the element deleted.
	 */
	delete(idOrAttrs) {
		if (typeof idOrAttrs === 'number') {
			return this._Model.where({ id: idOrAttrs }).destroy();
		}
		return this._Model.where(idOrAttrs).destroy();
	}

	/**
	 * Return every element of associated with the Model.
	 * @param {Array} columns Array of columns names to get.
	 * @return {Promise} A Promise with every element.
	 */
	getAll(columns) {
		return this._toJSON(this._Model.fetchAll({ columns }));
	}

	/**
	 * Select an element where Attributes equals.
	 * @param {Object} idOrAttrs - A number for an ID and an Object for different attributes.
	 * @param {Array} columns Array of columns names to get.
	 * @return {Promise} A Promise with the element found.
	 */
	get(idOrAttrs, columns) {
		if (typeof idOrAttrs === 'number') {
			return this._toJSON(this._Model.where('id', idOrAttrs).fetch({ columns }));
		}
		return this._toJSON(this._Model.where(idOrAttrs).fetch({ columns }));
	}

	/**
	 * Select an element and relation.
	 * @param {Object} idOrAttrs - A number for an ID and an Object for different attributes.
	 * @param {String} relation - The relation to call.
	 * @param {Array} columns Array of columns names to get.
	 * @return {Promise} A Promise with the element found.
	 */
	getRelated(idOrAttrs, relation, columns) {
		if (typeof idOrAttrs === 'number') {
			idOrAttrs = { id: idOrAttrs };
		}
		return this._toJSON(this._Model.forge(idOrAttrs).fetch({ withRelated: relation, columns }));
	}

	/**
	 * Return a clean represention of an element added or fetched from the database.
	 * @param {Promise} req - The database request.
	 * @return {Promise} A Promise with a clean Array or Object.
	 */
	_toJSON(req) {
		return req.then((result) => {
			if (!result) {
				return null;
			}
			const resultJson = result.toJSON();
			if (Array.isArray(resultJson)) {
				return LandsWarLib.camelCaseArray(resultJson);
			}
			return camelcaseKeys(resultJson);
		});
	}
}

module.exports = Base;
