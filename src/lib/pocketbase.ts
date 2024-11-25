import PocketBase from 'pocketbase';
import { PUBLIC_PB_HOST } from '$env/static/public';
import { PB_ADM_EMAIL, PB_ADM_PW } from '$env/static/private';

export const pb = new PocketBase(PUBLIC_PB_HOST)

await pb.admins.authWithPassword(PB_ADM_EMAIL, PB_ADM_PW);