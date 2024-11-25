import { error } from '@sveltejs/kit';
import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import { pb } from '$lib/pocketbase';


export async function load({ params }) {
	const getEvent = async () => {
		try {
			const event = await pb
				.collection('events')
				.getOne(params.eventId, { expand: 'speakers' });

			return event;
		} catch (err) {
			// console.log(err);
			throw error(404, err.message ?? 'Error');
		}
	};

	return {
		title: `${m.events()} | ${config.title}`,
		event: await getEvent()
	};
}
