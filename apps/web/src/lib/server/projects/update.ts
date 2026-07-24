import type { RequestEvent } from '@sveltejs/kit';
import { authenticate } from '../authenticate';
import { membership_model, project_model } from '../mongodb/models';
import { has_permission } from '../permissions';

export async function update_project(event: RequestEvent) {
	try {
		const authenticated = authenticate(event.cookies);

		if (!authenticated) {
			throw new Error('User not authenticated');
		}

		const data = await event.request.formData();
		const project_id = (data.get('id') as string)?.trim();
		const name = (data.get('name') as string)?.trim();

		if (!name) {
			return { error: 'Project name is required' };
		}

		const project = await project_model.findOne({ _id: project_id });

		if (!project) {
			return { error: 'Project not found' };
		}

		// Check if the authenticated user has permission to update the project
		const membership = await membership_model.findOne({
			user: authenticated.id,
			organization: project.organization
		});

		if (!membership) {
			return { error: 'Not a member of this organization' };
		}

		const can_update_project = await has_permission(
			{ _id: membership.user.toString(), role: membership.role },
			'update_project'
		);

		if (!can_update_project) {
			return { error: 'Insufficient permissions to update the project' };
		}

		// Update the project name
		project.name = name;
		await project.save();

		return { success: true, message: 'Project updated successfully' };
	} catch (error) {
		console.error('Error updating project:', error);
		return { error: 'An error occurred while updating the project' };
	}
}
