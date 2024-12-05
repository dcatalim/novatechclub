import PocketBase from 'pocketbase';
import { PUBLIC_PB_HOST } from '$env/static/public';

export const pb = new PocketBase(PUBLIC_PB_HOST)