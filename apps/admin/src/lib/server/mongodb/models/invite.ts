import { OrganizationRole } from '$lib/shared/enum';
import mongoose from 'mongoose';

const invite_schema = new mongoose.Schema(
	{
		organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
		email: { type: String, required: true },
		role: {
			type: String,
			enum: Object.values(OrganizationRole),
			default: OrganizationRole.MEMBER
		},
		invited_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
	},
	{ timestamps: true }
);

invite_schema.index({ organization: 1, email: 1 }, { unique: true });

export const invite_model = mongoose.model('Invite', invite_schema);
