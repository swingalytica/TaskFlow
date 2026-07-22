import mongoose from 'mongoose';

const organization_schema = new mongoose.Schema(
	{
		name: { type: String, required: true }
	},
	{ timestamps: true }
);

export const organization_model = mongoose.model('Organization', organization_schema);
