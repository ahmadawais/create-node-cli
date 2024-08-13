#!/usr/bin/env node
import cli from './utils/cli.js';
import generate from './utils/generate.js';
import init from './utils/init.js';
import log from './utils/log.js';

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

(async () => {
	await init({ clear });
	input.includes(`help`) && showHelp(0);
	debug && log(flags);
	await generate();
})();
