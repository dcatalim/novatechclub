import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';

export function load() {
	return {
		title: `${m.contacts()} | ${config.title}`
	};
}