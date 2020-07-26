/**
 * Utilities for interacting with image cloud storage
 */

import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Img as ReactImage } from 'react-image';

const baseImageUrl = 'https://datapadassets.blob.core.windows.net';

/**
 * Renders the contact image for the specified contact if one exists. Otherwise displays
 * the `missing contact` image.
 */
export function renderFactionEmblem(
	factionName: string,
	displayHeightInPixels: number,
): React.ReactNode {
	const cleanedName = cleanName(factionName);
	const factionImageUrl = `${baseImageUrl}/factions/${cleanedName}.png`;
	return loadAndRenderImage([factionImageUrl], displayHeightInPixels);
}

// TODO: timeout on load attempt.
/**
 * Renders the faction image for the specified faction.
 * Assumes that one exists, if it doesn't, this will fail to converge.
 */
export function renderContactImage(
	contactName: string,
	displayHeightInPixels: number,
): React.ReactNode {
	const cleanedName = cleanName(contactName);
	const contactUrl = `${baseImageUrl}/contacts/${cleanedName}.png`;
	const missingContactImage = 'images/Missing-Contact-Image.png';
	return loadAndRenderImage([contactUrl, missingContactImage], displayHeightInPixels);
}

// TODO: timeout after some provided time. Stop spinner and display error.
/**
 * Renders the first image found in the list of urls. Multiple images can be used to
 * handle the case where the requested image does not exists, or 404s or what-have-you.
 * Displays a spinner while the image is being loaded.
 */
export function loadAndRenderImage(
	imageUrls: string[],
	displayHeightInPixels: number,
): React.ReactNode {
	const spinner = <Spinner animation="border" variant="light"></Spinner>;
	return (
		<ReactImage src={imageUrls} loader={spinner} height={displayHeightInPixels}></ReactImage>
	);
}

function cleanName(value: string): string {
	return value.replace(' ', '-').replace(/[^0-9a-zA-Z_\-]/g, '');
}
