module.exports = function registerStrategy(server) {
	server.auth.strategy('token', 'jwt', {
		key:           process.env.SECRET_KEY,
		verifyOptions: { algorithms: ['HS256'] },
	});
	server.auth.default('token');
};

// const Player = require('./../models/player');
/*
    validateFunc: async (request, decodedToken, callback) => {
      try {
        const player = await Player.get({ id: decodedToken.id, nickname: decodedToken.nickname });
        if (!player) {
          return callback(undefined, false, player);
        }
        return callback(undefined, true, player);
      } catch (error) {
        logger.error(error);
        return callback(undefined, false, player);
      }
    },
*/
