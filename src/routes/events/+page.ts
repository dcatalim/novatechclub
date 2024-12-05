import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';

export function load() {
	const getEvents = async () => {
		try {
			const events = await pb.collection('events').getFullList({
				sort: "-created",
				expand: "speakers"
			});

			return events
		} catch (err) {
			// console.log(err);
			throw error(404, err.message ?? 'Error');
		}
	};

	return {
		title: `${m.events()} | ${config.title}`,
		events: getEvents()
	};
}
