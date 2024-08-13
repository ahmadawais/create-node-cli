import handleError from 'cli-handle-error';
import shouldCancel from 'cli-should-cancel';
import { Store } from 'data-store';
import enquirer from 'enquirer';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
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
			store: new Store({
				path: join(homedir(), `.history/create-node-cli/${name}.json`)
			})
		};
	}

	try {
		const response = await new Input({
			name,
			message,
			hint,
			initial,
			history,
			validate(value, state) {
				if (state && state.name === `command`) return true;
				if (state && state.name === `name`) {
					if (existsSync(value)) {
						return `Directory already exists: ./${value}`;
					} else {
						return true;
					}
				}
				return !value ? `Please add a value.` : true;
			}
		})
			.on(`cancel`, () => shouldCancel())
			.run();

		return response;
	} catch (err) {
		handleError(`INPUT`, err);
		return null; // or handle the error as appropriate for your use case
	}
};
