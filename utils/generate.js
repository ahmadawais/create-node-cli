const ora = require('ora');
const path = require('path');
const execa = require('execa');
const alert = require('cli-alerts');
const copy = require('copy-template-dir');
const { green: g, yellow: y, dim: d } = require('chalk');

const spinner = ora({ text: '' });
const questions = require('./questions');

module.exports = async () => {
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
			`meow@9.0.0`,
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
