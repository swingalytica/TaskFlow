import { authenticate } from '$lib/server/authenticate';
import { invite_model } from '$lib/server/mongodb/models/invite';
import { membership_model, OrganizationRole } from '$lib/server/mongodb/models/membership';
import { organization_model } from '$lib/server/mongodb/models/organization';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const authenticated = authenticate(event.cookies);

		if (!authenticated) {
			throw new Error('User not authenticated');
		}

		const memberships = await membership_model
			.find({ user: authenticated.id })
			.populate('organization');

		const pending_invites = await invite_model
			.find({ email: authenticated.email })
			.populate('organization');

		return {
			memberships: JSON.parse(JSON.stringify(memberships)),
			pending_invites: JSON.parse(JSON.stringify(pending_invites))
		};
	} catch (error) {
		console.error(error);
		return { memberships: [], pending_invites: [] };
	}
};

export const actions: Actions = {
	create_organisation: async ({ request, cookies }) => {
		const authenticated = authenticate(cookies);

		if (!authenticated) {
			throw new Error('User not authenticated');
		}

		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const icon = (data.get('logo_url') as string)?.trim();

		if (!name) {
			return { error: 'Organization name is required' };
		}

		try {
			const new_organisation = await organization_model.create({ name, icon });

			await membership_model.create({
				user: authenticated.id,
				organization: new_organisation._id,
				role: OrganizationRole.OWNER
			});

			return { success: true, organisation: JSON.parse(JSON.stringify(new_organisation)) };
		} catch (error) {
			console.error(error);
			return { error: 'Failed to create organization' };
		}
	},
	accept_invite: async ({ request, cookies }) => {
		const authenticated = authenticate(cookies);

		if (!authenticated) {
			throw new Error('User not authenticated');
		}

		const data = await request.formData();
		const invite_id = data.get('invite_id') as string;

		if (!invite_id) {
			return { error: 'invite_id is required' };
		}

		const invite = await invite_model.findOne({ _id: invite_id, email: authenticated.email });

		if (!invite) {
			return { error: 'Invite not found' };
		}

		const existing_membership = await membership_model.findOne({
			user: authenticated.id,
			organization: invite.organization
		});

		if (existing_membership) {
			await invite_model.deleteOne({ _id: invite_id });

			return { error: 'You are already a member of this organization' };
		}

		try {
			await membership_model.create({
				user: authenticated.id,
				organization: invite.organization,
				role: invite.role
			});

			await invite_model.deleteOne({ _id: invite_id });

			return { success: true };
		} catch (error) {
			console.error(error);
			return { error: 'Failed to accept invite' };
		}
	}
};
