import mongoose from 'mongoose';

export enum ActivityType {
	CREATED = 'CREATED',
	COMPLETED = 'COMPLETED',
	ARCHIVED = 'ARCHIVED',
	MOVED = 'MOVED',
	ASSIGNED = 'ASSIGNED',
	UNASSIGNED = 'UNASSIGNED',
	MESSAGE = 'MESSAGE',
	ADD_CHECKLIST_ITEM = 'ADD_CHECKLIST_ITEM',
	REMOVE_CHECKLIST_ITEM = 'REMOVE_CHECKLIST_ITEM',
	UPDATE_CHECKLIST_ITEM = 'UPDATE_CHECKLIST_ITEM'
}

const activity_schema = new mongoose.Schema(
	{
		card: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Card',
			required: true
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		type: {
			type: String,
			enum: Object.values(ActivityType),
			required: true
		},
		data: {
			type: mongoose.Schema.Types.Mixed
		}
	},
	{
		timestamps: true
	}
);

activity_schema.index({
	card: 1,
	createdAt: -1
});

export const activity_model = mongoose.model('Activity', activity_schema);
