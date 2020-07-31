import { Id } from '../../utilities/DatabaseUtilities';

// TODO: get from schema
export interface Contact {
	_id: Id;
	name: string;
	imageUrl?: string;
	race?: string; // undefined === "Unkown"
	gender?: string; // undefined === "Unkown"
	affiliations?: string[]; // undefined === "None"
	status?: string; // undefined === "Unkown"
}
