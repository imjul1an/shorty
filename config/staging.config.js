var config = {
	connection: process.env.MONGO_CONNECTION,
	options: { auto_reconnect: true },

	applicationUrl: 'http://shorty.com',
	logentries: {
		token: process.env.LOGENTRIES_TOKEN
	}
};

module.exports = config;