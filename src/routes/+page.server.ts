import { login_user } from '$lib/server/login';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const email = (data.get('email') as string)?.toLowerCase()?.trim();
		const password = data.get('password') as string;

		const user_data = await login_user(email, password);

		if ('error' in user_data) {
			return fail(400, { email, error: user_data.error });
		}

		return { email, user: user_data.user };
	}
};
