import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';

export function load() {
	const getProjects = async () => {
		try {
			const projects = await pb.collection('projects').getFullList({
				sort: "-created",
				expand: "team"

			});

			return projects
		} catch (err) {
			// console.log(err);
			return err
		}
	};

	return {
		title: `${m.projects()} | ${config.title}`,
		projects: getProjects()
	};
}
