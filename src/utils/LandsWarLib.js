const jwt = Promise.promisifyAll(require('jsonwebtoken'));

const JWT_SECRET = 'landswar - topsecret';

/**
 * The library of LandsWar
 */
class LandsWarLib {
	/**
	 * Return true if the object is empty.
	 * @param  {Object}  object - The object.
	 * @return {Boolean} True if the object is empty.
	 */
	static isObjectEmpty(object) {
		return Object.keys(object).length === 0;
	}

	/**
	 * Create a new token.
	 * @param  {Number} idUser - The id of the player.
	 * @param  {String} nickname - The nickname of the player.
	 * @return {Promsie} A Promise.
	 */
	static createToken(idUser, nickname) {
		return jwt.signAsync({
			id: idUser,
			nickname,
		}, JWT_SECRET, {
			expiresIn:   '30 days',
			noTimestamp: true,
		})
		.then((token) => token)
		.catch((error) => Promise.reject(error));
	}

	/**
	 * Verifty if a jwt is valid.
	 * @param {String} token - The token.
	 * @return {Promise} A Promise with the decoded value.
	 */
	static verifyJwt(token) {
		return jwt.verifyAsync(token, JWT_SECRET)
		.then((decoded) => decoded)
		.catch(() => 'Token expired!');
	}

	/**
	 * Shuffle an array.
	 * https://github.com/coolaj86/knuth-shuffle/blob/master/index.js
	 * @param  {Array} array - The array
	 * @return {Array} The shuffled array.
	 */
	static shuffleArray(array) {
		let currentIndex = array.length;
		let temporaryValue;
		let randomIndex;

		// While there remain elements to shuffle...
		while (currentIndex !== 0) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			--currentIndex;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
}

module.exports = LandsWarLib;
