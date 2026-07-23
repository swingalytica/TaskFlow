import { authenticate } from '$lib/server/authenticate';
import { user_model } from '$lib/server/mongodb/models/user';
import { verify_name } from '$lib/server/register';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const authenticated = authenticate(event.cookies);

		if (!authenticated) {
			return {
				status: 401,
				error: new Error('Unauthorized')
			};
		}

		const user = await user_model.findById(authenticated.id);

		if (!user) {
			return {
				status: 404,
				error: new Error('User not found')
			};
		}

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				avatar: user.avatar
			}
		};
	} catch (error) {
		console.error('Error loading user settings:', error);
		throw new Error('Failed to load user settings');
	}
};

export const actions: Actions = {
	update_profile: async (event) => {
		try {
			const authenticated = authenticate(event.cookies);

			if (!authenticated) {
				return {
					status: 401,
					error: new Error('Unauthorized')
				};
			}

			const formData = await event.request.formData();
			const name = formData.get('name') as string;
			const avatar = formData.get('avatar') as string;

			const user = await user_model.findById(authenticated.id);

			if (!user) {
				return {
					status: 404,
					error: 'User not found'
				};
			}

			const name_error = verify_name(name);

			if (name_error) {
				return {
					status: 400,
					error: name_error
				};
			}

			user.name = name;
			user.avatar = avatar;
			await user.save();

			return {
				status: 200,
				message: 'Profile updated successfully'
			};
		} catch (error) {
			console.error('Error updating profile:', error);
			return {
				status: 500,
				error: new Error('Failed to update profile')
			};
		}
	}
};
