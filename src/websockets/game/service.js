/**
 * Static class to handle the game/model logic.
 */
class GameService {
}

module.exports = function (server) {
	GameService.redisModels = server.methods.redis;
	GameService.lib = server.methods.lib;
	return GameService;
};
