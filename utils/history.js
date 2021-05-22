const os = require('os');
const path = require('path');

module.exports = {
	getHistoryDirectory: () => {
		const XDG_CACHE_HOME = process.env.XDG_CACHE_HOME;
		const FALLBACK_CACHE_DIRECTORY = path.join(os.homedir(), '.cache');

		if (XDG_CACHE_HOME) {
			return path.join(XDG_CACHE_HOME, 'create-node-cli');
		}

		if (FALLBACK_CACHE_DIRECTORY) {
			return path.join(FALLBACK_CACHE_DIRECTORY, 'create-node-cli');
		}
	}
};
