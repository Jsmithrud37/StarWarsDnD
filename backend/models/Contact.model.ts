import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
	{
		name: { type: String, required: true },
		race: { type: String, required: false },
		gender: { type: String, required: false },
		affiliations: { type: [String], required: false },
	},
	{
		timestamps: true,
	},
);

const Contact = model('Contact', contactSchema);
export default Contact;
