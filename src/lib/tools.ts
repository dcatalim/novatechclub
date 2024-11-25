import { PUBLIC_PB_HOST } from '$env/static/public';
import { languageTag } from '$lib/paraglide/runtime.js';

export function scrollToAnchor(elementId: string) {
	const element = document.getElementById(elementId);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
}

export function formatDate(dateString: string) {
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	if (languageTag() === 'pt') {
		return new Date(dateString).toLocaleDateString('pt-PT', options);
	} else {
		return new Date(dateString).toLocaleDateString('en-US', options);
	}
}

export function getInitials(name: string) {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase();
}

export const getImageURL = (collectionId, recordId, fileName, size = '100x100') => {
	return `${PUBLIC_PB_HOST}/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};
