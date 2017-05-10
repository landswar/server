const camelcaseKeys = require('camelcase-keys');

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
	 * Update an element to the database.
	 * @param {Number} id - Id of the element to update.
	 * @param {Object} attrs - Attributes of the element to update.
	 * @return {Promise} A Promise with the element updated.
	 */
	update(id, attrs) {
		return this._Model.where('id', id).fetch().then(ret => {
			for (let key in attrs) {
				ret.attributes[key] = attrs[key];
			}
			return this._toJSON(ret.save());
		}).catch(err => {
			return err;
		});
	}

	/**
	 * Delete an element from the database.
	 * @param {Number} id - Id of the element to delete.
	 * @return {Promise} A Promise with the element deleted.
	 */
	delete(id) {
		return new this._Model({id: id}).destroy();
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
				resultJson.forEach((value, index, array) => {
					array[index] = camelcaseKeys(value);
				});
				return resultJson;
			}
			return camelcaseKeys(resultJson);
		});
	}
}

module.exports = Base;
