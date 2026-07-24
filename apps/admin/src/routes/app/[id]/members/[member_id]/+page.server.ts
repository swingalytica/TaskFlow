import { authenticate } from '$lib/server/authenticate';
import { membership_model } from '$lib/server/mongodb/models/membership';
import { permission_override_model } from '$lib/server/mongodb/models/permission';
import type { OrganizationRole } from '$lib/shared/enum';
import { permissions } from '$lib/shared/permissions.const';
import { fail, type Actions, type Cookies } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event: {
	params: { member_id: string };
	cookies: Cookies;
}) => {
	const { member_id } = event.params;
	const authenticated = authenticate(event.cookies);

	if (!authenticated) {
		throw new Error('User not authenticated');
	}

	const membership = await membership_model
		.findOne({ user: member_id })
		.populate('user', 'email')
		.lean();

	if (!membership) {
		return { error: 'Member not found' };
	}

	const overrides = await permission_override_model.find({ membership: member_id }).lean();

	const override_map = new Map(overrides.map((o) => [o.permission, o.value]));

	const permission_rows = Object.entries(permissions).map(([key, allowed_roles]) => ({
		key,
		default_allowed: (allowed_roles as readonly OrganizationRole[]).includes(membership.role),
		override: override_map.get(key) ?? null
	}));

	return {
		membership: JSON.parse(JSON.stringify(membership)),
		permission_rows
	};
};

export const actions: Actions = {
	set_permission_override: async (event) => {
		const { member_id } = event.params;
		const authenticated = authenticate(event.cookies);

		if (!authenticated) {
			return fail(401, { error: 'Not authenticated' });
		}

		const data = await event.request.formData();
		const permission = data.get('permission') as string;
		const state = data.get('state') as string; // 'default' | 'allow' | 'deny'

		if (!permission || !state) {
			return fail(400, { error: 'permission and state are required' });
		}

		if (state === 'default') {
			await permission_override_model.deleteOne({
				membership: member_id,
				permission
			});
		} else {
			await permission_override_model.findOneAndUpdate(
				{ membership: member_id, permission },
				{ value: state === 'allow' },
				{ upsert: true }
			);
		}

		return { success: true };
	}
};
