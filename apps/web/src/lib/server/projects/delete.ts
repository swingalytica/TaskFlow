import type { RequestEvent } from '@sveltejs/kit';
import { authenticate } from '../authenticate';
import {
	activity_model,
	board_model,
	card_model,
	membership_model,
	project_model
} from '../mongodb/models';
import { has_permission } from '../permissions';

export async function delete_project(
	event: RequestEvent
): Promise<{ success: boolean | undefined } | { error: string | undefined }> {
	try {
		const form_data = await event.request.formData();
		const project_id = form_data.get('id') as string;

		const authenticated = authenticate(event.cookies);

		if (!authenticated) {
			throw new Error('User not authenticated');
		}

		const membership = await membership_model.findOne({
			user: authenticated.id,
			organization: event.params.id
		});

		if (!membership) {
			return { error: 'Not a member of this organization' };
		}

		const can_delete_project = await has_permission(
			{ _id: membership.user.toString(), role: membership.role },
			'delete_project'
		);

		if (!can_delete_project) {
			return { error: 'Insufficient permissions to delete a project' };
		}

		await project_model.findByIdAndDelete(project_id);
		await board_model.deleteMany({ project: project_id });
		await card_model.deleteMany({
			board: { $in: (await board_model.find({ project: project_id })).map((b) => b._id) }
		});
		await activity_model.deleteMany({
			card: {
				$in: (
					await card_model.find({
						board: { $in: (await board_model.find({ project: project_id })).map((b) => b._id) }
					})
				).map((c) => c._id)
			}
		});

		return { success: true };
	} catch (error) {
		console.log(error);
		return { success: false };
	}
}
