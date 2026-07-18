import { register_user } from '$lib/server/register';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const email = (data.get('email') as string)?.toLowerCase()?.trim();
		const password = (data.get('password') as string)?.trim();

		const user = await register_user(email, password);
	}
};
