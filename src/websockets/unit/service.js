/**
 * Static class to handle unit logic.
 */
class UnitService {
	/**
	 * Move a unit to new coord (if possible)
	 * @param {Object} unit Unit to move
	 * @param {Number} newX New x position
	 * @param {Number} newY New y position
	 * @return {Boolean} True if the unit can move to the given coordinate
	 */
	static moveTo(unit, newX, newY) {
		const deltaX = Math.abs(newX - unit.x);
		const deltaY = Math.abs(newY - unit.x);
		if (deltaX + deltaY > unit.move) {
			return false;
		}
		unit.x = newX;
		unit.y = newY;
//		return UnitService.redisModels.unit.setValues(unit.shortIdRoom,
//						unit.id, unit.redisId, unit);
		return true;
	}

	/**
	 * Attack a unit
	 * @param {Object} unit Unit who attack
	 * @param {Object} target Unit which is the target
	 * @return {Boolean} True if the attack is correct (good position, ...)
	 */
	static attack(unit, target) {
		const deltaX = Math.abs(unit.x - target.x);
		const deltaY = Math.abs(unit.y - target.y);
		if (unit.rangeMin < deltaX + deltaY || unit.rangeMax > deltaX + deltaY) {
			return false;
		}
		target.life -= 1;
		unit.ammo1 -= 1;
		return true;
	}
}

module.exports = function (server) {
	UnitService.redisModels = server.methods.redis;
	UnitService.lib = server.methods.lib;
	return UnitService;
};
