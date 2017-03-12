/**
 * Static class to handle the game/model logic.
 */
class RoomService {
	/**
	 * Return true if there is enough space in the room for a new player.
	 * @param  {Object} redisRoom - Object returned by ioredis.
	 * @return {Boolean} True if there is enough space.
	 */
	static isFreeSpace(redisRoom) {
		return redisRoom.nbPlayer < redisRoom.nbMaxPlayer;
	}

	/**
	 * Start the game by setting default values.
	 * @param  {String} shortIdRoom - The token of the room.
	 * @param  {Object} redisRoom - Object returned by ioredis.
	 * @return {Promise} A Promise (hmset).
	 */
	static async start(shortIdRoom, redisRoom) {
		const ids = await RoomService.redisModels.player.getAllPlayerInRoom(shortIdRoom);

		redisRoom.nbTurn = 1;
		redisRoom.playersOrders = RoomService.lib.shuffleArray(ids);
		redisRoom.playerTurn = redisRoom.playersOrders[0];

		return RoomService.redisModels.room.setValues({
			nbTurn:        redisRoom.nbTurn,
			playersOrders: redisRoom.playersOrders.join(),
			playerTurn:    redisRoom.playerTurn,
		});
	}
}

module.exports = function (server) {
	RoomService.redisModels = server.methods.redis;
	RoomService.lib = server.methods.lib;
	return RoomService;
};
