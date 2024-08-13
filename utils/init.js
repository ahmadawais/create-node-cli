import unhandled from 'cli-handle-unhandled';
import welcome from 'cli-welcome';
import { getPackageJson } from 'get-package-json-file';

export default async ({ clear = true }) => {
	unhandled();
	const pkgJson = await getPackageJson(`./../package.json`);
	welcome({
		title: `create-node-cli`,
		tagLine: `by Awais.dev`,
		description: pkgJson.description,
		version: pkgJson.version,
		bgColor: '#6cc24a',
		color: '#000000',
		bold: true,
		clear
	});
};
