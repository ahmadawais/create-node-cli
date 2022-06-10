#!/usr/bin/env -S node --no-warnings

import init from './utils/init.js';
import cli from './utils/cli.js';
import generate from './utils/generate.js';
import log from './utils/log.js';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes('help') && cli.showHelp(0);
	debug && log(flags);

	await generate();
})();
