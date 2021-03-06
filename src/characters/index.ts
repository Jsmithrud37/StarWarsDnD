import { Id } from '../utilities/DatabaseUtilities';

// TODO: get from schema
export interface PhysicalAttribute {
	/**
	 * Name of the attribute
	 */
	name: string;

	/**
	 * Value of the attribute
	 */
	value: string;
}

// TODO: get from schema
export interface Character {
	_id: Id;
	name: string;
	shortName?: string;
	species?: string; // undefined === "Unkown"
	speciesUrl?: string; // undefined => Use default url generation
	gender?: string; // undefined === "Unkown"
	homeworld?: string; // undefined === "Unknown"
	affiliations?: string[]; // undefined === "None"
	status?: string; // undefined === "Unkown"
	bio?: string; // undefined === no bio
	knownBy?: string[]; // undefined === known by everyone. Empty === known by no one.
	titles?: string[]; // undefined === no titles
	physicalAttributes?: PhysicalAttribute[]; // undefined === no attributes
	imageResourceName?: string; // undefined === use `name` as image resource base name
	summary?: string; // undefined === no summary
}

// TODO: get from schema
export interface PlayerCharacter extends Character {
	player: string;
}

// TODO: get from schema
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NonPlayerCharacter extends Character {
	// TODO?
}

/**
 * Returns whether or not the contact is a Droid.
 */
export function isDroid(character: Character): boolean {
	return character.species === 'Droid';
}

/**
 * Determines whether or not the contact has any faction affiliations
 */
export function getMaybeFirstFactionAffiliation(character: Character): string | undefined {
	return character.affiliations !== undefined && character.affiliations.length > 0
		? character.affiliations[0]
		: undefined;
}

/**
 * Gets the resource name base for the character. If a specific one is provided, uses that,
 * otherwise uses the `name` field.
 */
export function getImageResourceBaseName(character: Character): string {
	return character.imageResourceName ? character.imageResourceName : character.name;
}

/**
 * Gets the summary for the given character, if it has one.
 * Otherwise, returns the first title if the character has titles.
 * Otherwise returns undefined;
 */
export function getSummaryOrTitle(character: Character): string | undefined {
	return character.summary
		? character.summary
		: character.titles && character.titles.length !== 0
		? character.titles[0]
		: undefined;
}

/**
 * Gets the character's short name if it has one, otherwise the full name
 */
export function getShortNameOrName(character: Character): string {
	return character.shortName ?? character.name;
}
