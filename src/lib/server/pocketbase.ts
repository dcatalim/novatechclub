import { building } from '$app/environment';
import { PB_ADM_EMAIL, PB_ADM_PW } from '$env/static/private';
import { PUBLIC_PB_HOST } from '$env/static/public';
import PocketBase from 'pocketbase';

const pbAdmin = new PocketBase(PUBLIC_PB_HOST);

if (!building) {
	// disable autocancellation so that we can handle async requests from multiple users
	pbAdmin.autoCancellation(false);

	// option 1: authenticate as superuser using email/password (could be filled with ENV params)
	await pbAdmin.admins.authWithPassword(PB_ADM_EMAIL, PB_ADM_PW, {
		// This will trigger auto refresh or auto reauthentication in case
		// the token has expired or is going to expire in the next 30 minutes.
		autoRefreshThreshold: 30 * 60
	});
}

export default pbAdmin;
