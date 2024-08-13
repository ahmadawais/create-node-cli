import canPnpm from 'can-pnpm';
import chalk from 'chalk';
import alert from 'cli-alerts';
import copy from 'copy-template-dir';
import { execa } from 'execa';
import ora from 'ora';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import questions from './questions.js';

const spinner = ora({ text: '' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async () => {
	const vars = await questions();
	const outDir = vars.name;
	const inDirPath = join(__dirname, `../template`);
	const outDirPath = join(process.cwd(), outDir);

	const { canPnpm: isPnpmAvailable } = await canPnpm();
	const pm = isPnpmAvailable ? 'pnpm' : 'npm';

	copy(inDirPath, outDirPath, vars, async (err, createdFiles) => {
		if (err) throw err;

		console.log(
			chalk.dim(
				`\nCreating files in ${chalk.green(`./${outDir}`)} directory:\n`
			)
		);

		createdFiles.forEach(filePath => {
			const fileName = basename(filePath);
			console.log(`${chalk.green(`CREATED`)} ${fileName}`);
		});

		console.log();
		spinner.start(
			`${chalk.yellow(`DEPENDENCIES`)} installing…\n\n${chalk.dim(
				`It may take moment…`
			)}`
		);
		process.chdir(outDirPath);
		const pkgs = [
			`meow@latest`,
			`chalk@latest`,
			`cli-alerts@latest`,
			`cli-welcome@latest`,
			`cli-meow-help@latest`,
			`cli-handle-error@latest`,
			`cli-handle-unhandled@latest`,
			`get-package-json-file@latest`
		];

		await execa(pm, [`install`, ...pkgs]);
		await execa(pm, [`install`, `prettier`, `-D`]);
		await execa(pm, [`dedupe`]);
		spinner.succeed(`${chalk.green(`DEPENDENCIES`)} installed!`);

		alert({
			type: `success`,
			name: `ALL DONE`,
			msg: `\n\n${createdFiles.length} files created in ${chalk.dim(
				`./${outDir}`
			)} directory`
		});
	});
};
