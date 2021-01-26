import { ThemeColor } from '../../Theming';
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

/**
 * Gets the theme color for a timeline event.
 */
export function getThemeColorForEvent(event: TimelineEvent): ThemeColor {
	switch (event.kind) {
		case EventKind.Galaxy:
			return ThemeColor.Red;
		case EventKind.Party:
			return ThemeColor.Green;
		case EventKind.Character:
			return ThemeColor.Purple;
		default:
			return ThemeColor.Blue;
	}
}
