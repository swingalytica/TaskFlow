import { authenticate } from '$lib/server/authenticate';
import { membership_model, OrganizationRole } from '$lib/server/mongodb/models/membership';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const authenticated = authenticate(event.cookies);

		if (!authenticated) {
			throw new Error('User not authenticated');
		}

		const memberships = await membership_model
			.find({
				user: authenticated.id,
				role: { $in: [OrganizationRole.OWNER, OrganizationRole.ADMIN] }
			})
			.populate('organization');

		return {
			memberships: JSON.parse(JSON.stringify(memberships))
		};
	} catch (error) {
		console.error(error);
		return { memberships: [] };
	}
};
