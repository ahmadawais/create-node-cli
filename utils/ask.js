import os from 'os';
import * as fs from 'fs';
import enquirer from 'enquirer';
import path from 'path';

import { to } from 'await-to-js';
import handleError from 'cli-handle-error';
import shouldCancel from 'cli-should-cancel';
import datastore from 'data-store';

const { Input } = enquirer;

export default async ({ name, message, hint, initial }) => {
	let history = false;
	if (
		!initial &&
		name !== `name` &&
		name !== `command` &&
		name !== `description`
	) {
		history = {
			autosave: true,
			store: new datastore({
				path: path.join(
					os.homedir(),
					`.history/create-node-cli/${name}.json`
				)
			})
		};
	}
	const [err, response] = await to(
		new Input({
			name,
			message,
			hint,
			initial,
			history,
			validate(value, state) {
				if (state && state.name === `command`) return true;
				if (state && state.name === `name`) {
					if (fs.existsSync(value)) {
						return `Directory already exists: ./${value}`;
					} else {
						return true;
					}
				}
				return !value ? `Please add a value.` : true;
			}
		})
			.on(`cancel`, () => shouldCancel())
			.run()
	);
	handleError(`INPUT`, err);

	return response;
};
