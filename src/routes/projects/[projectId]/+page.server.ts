import { error } from '@sveltejs/kit';
import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import { pb } from '$lib/pocketbase';


export async function load({ params }) {
	const getProject = async () => {
		try {
			const project = await pb
				.collection('projects')
				.getOne(params.projectId, { expand: 'team' });

			return project;
		} catch (err) {
			// console.log(err);
			return err
		}
	};

	const project = await getProject();

	const { title } = project;

	return {
		title: `${title} | ${config.title}`,
		project: project
	};
}
