import path from 'path';
import copy from 'copy-template-dir';
import alert from 'cli-alerts';
import chalk from 'chalk';
// import generateJSON from './generateJSON.js';
import ora from 'ora';
import { execa } from 'execa';
import questions from './questions.js';

const g = chalk.green;
const d = chalk.dim;
const y = chalk.yellow;

const spinner = ora({ text: '' });

//* __dirname workaround for ESM ----------------------------------
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
//* ---------------------------------------------------------------

export default async () => {
	const vars = await questions();
	const outDir = vars.name;
	const inDirPath = path.join(__dirname, `../template`);
	const outDirPath = path.join(process.cwd(), outDir);

	copy(inDirPath, outDirPath, vars, async (err, createdFiles) => {
		if (err) throw err;

		console.log(d(`\nCreating files in ${g(`./${outDir}`)} directory:\n`));

		createdFiles.forEach(filePath => {
			const fileName = path.basename(filePath);
			console.log(`${g(`CREATED`)} ${fileName}`);
		});

		console.log();
		spinner.start(
			`${y(`DEPENDENCIES`)} installing…\n\n${d(`It may take moment…`)}`
		);
		process.chdir(outDirPath);
		const pkgs = [
			`meow@latest`,
			`chalk@latest`,
			`cli-alerts@latest`,
			`cli-welcome@latest`,
			`cli-meow-help@latest`,
			`cli-handle-error@latest`,
			`cli-handle-unhandled@latest`
		];

		await execa(`npm`, [`install`, ...pkgs]);
		await execa(`npm`, [`install`, `prettier`, `-D`]);
		await execa(`npm`, [`dedupe`]);
		spinner.succeed(`${g(`DEPENDENCIES`)} installed!`);

		alert({
			type: `success`,
			name: `ALL DONE`,
			msg: `\n\n${createdFiles.length} files created in ${d(
				`./${outDir}`
			)} directory`
		});
	});
};
