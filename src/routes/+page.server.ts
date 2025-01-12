import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';

export function load() {
	const getProjects = async () => {
		try {
			const projects = await pb.collection('projects').getList(1, 3, {
				sort: '-created',
				expand: 'team'
			});

			return projects;
		} catch (err) {
			// console.log(err);
			return err
		}
	};

	const getEvents = async () => {
		try {
			const events = await pb.collection('events').getList(1, 3, {
				sort: '-created',
				expand: 'speakers'
			});

			return events;
		} catch (err) {
			// console.log(err);
			return err
		}
	};

	const getArticles = async () => {
		try {
			const articles = await pb.collection('articles').getList(1, 3, {
				sort: '-created',
				expand: 'author'
			});

			return articles;
		} catch (err) {
			// console.log(err);
			return err
		}
	};

	return {
		title: `${m.home()} | ${config.title}`,
		projects: getProjects(),
		articles: getArticles(),
		events: getEvents(),
	};
}
