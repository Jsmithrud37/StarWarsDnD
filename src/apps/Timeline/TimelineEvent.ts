import { Id } from '../../utilities/DatabaseUtilities';

export interface TimelineEvent {
	_id: Id;
	title: string;
	year: number;
	day: number;
	location: string;
	description?: string;
	involvedFactions?: string[];
	kind: EventKind;
}

export enum EventKind {
	Galaxy = 'galaxy',
	Party = 'party',
	Character = 'character',
}
