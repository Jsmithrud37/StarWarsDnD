import React from 'react';
import { Character } from '../characters';

const unknownString = 'Unknown';

/**
 * Renders a Wookieepedia link for the specified character's species if one was provided
 */
export function renderSpeciesLink(character: Character): React.ReactElement | string {
	const speciesLink = getSpeciesLinkUrl(character);

	return character.species ? (
		<a href={speciesLink} target="_blank" rel="noopener noreferrer">
			{character.species}
		</a>
	) : (
		unknownString
	);
}

/**
 * Gets the Wookieepedia link for the character's species, if one was specified
 */
export function getSpeciesLinkUrl(character: Character): string | undefined {
	if (character.speciesUrl) {
		return character.speciesUrl;
	}
	return character.species
		? `https://starwars.fandom.com/wiki/${character.species.replace(' ', '_')}`
		: undefined;
}

/**
 * Renders a Wookieepedia link for the character's homeworld if one was specified
 */
export function renderHomeworldLink(character: Character): React.ReactElement | string {
	const homeworldLink = getHomeworldLinkUrl(character);

	return character.homeworld ? (
		<a href={homeworldLink} target="_blank" rel="noopener noreferrer">
			{character.homeworld}
		</a>
	) : (
		unknownString
	);
}

/**
 * Gets the Wookieepedia link for the character's homeworld, if one was specified
 */
export function getHomeworldLinkUrl(character: Character): string | undefined {
	return character.homeworld
		? `https://starwars.fandom.com/wiki/${character.homeworld.replace(' ', '_')}`
		: undefined;
}
