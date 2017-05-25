module.exports = function registerStrategy(server) {
	server.auth.strategy('token', 'jwt', {
		key:           process.env.SECRET_KEY || 'landswartopsecret',
		verifyOptions: { algorithms: ['HS256'] },
	});
	server.auth.default('token');
};
