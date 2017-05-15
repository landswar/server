const Hapi = require('hapi');

/**
 * Class with helper method to test the server.
 */
class Helper {
	/**
	 * Create the Hapi server.
	 */
	constructor() {
		this.server = new Hapi.Server();
		this.server.connection({ port: 3000 });
	}

	/**
	 * Register plugins to the Hapi server.
	 * @param {Array} plugins - An array of plugin Object.
	 */
	registerPlugins(plugins) {
		this.server.register(this._createRegisterArray(plugins));
	}

	/**
	 * Return a clean array to send to the server.register method.
	 * @param {Array} plugins - An array of plugin Object.
	 * @return {Array} An array of plugin (register: plugin).
	 */
	_createRegisterArray(plugins) {
		const pluginsToRegister = [];
		plugins.forEach((plugin) => {
			pluginsToRegister.push({ register: plugin });
		});
		return pluginsToRegister;
	}

	/**
	 * Call the inject method of the Hapi server. Helpful to test REST route.
	 * @param {Object} params - An Object with route information and data to send.
	 * @return {Promise} A Promise with the result of the call.
	 */
	inject(params) {
		return this.server.inject(params);
	}
}

module.exports = Helper;
