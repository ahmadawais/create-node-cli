#!/usr/bin/env node

/**
 * {{name}}
 * {{description}}
 *
 * @author {{authorName}} <{{authorUrl}}>
 */

import cli from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

(async () => {
	await init({ clear });
	debug && log(flags);
	input.includes(`help`) && showHelp(0);
})();
