import { OrganizationRole } from '$lib/shared/enum';
import { membership_model } from '../mongodb/models';

export async function require_admin(user_id: string, organization_id: string) {
	const membership = await membership_model.findOne({
		user: user_id,
		organization: organization_id
	});

	if (
		!membership ||
		(membership.role !== OrganizationRole.OWNER && membership.role !== OrganizationRole.ADMIN)
	) {
		return null;
	}

	return membership;
}
