/**
 * Utilities for interacting with image cloud storage
 */

import React from 'react';
import { Img as ReactImage } from 'react-image';
import { CircularProgress } from '@material-ui/core';
import { Character, getImageResourceBaseName } from '../characters';

const baseImageUrl = 'https://datapadassets.blob.core.windows.net';

/**
 * Shape options for image cropping.
 */
export enum ImageContainerShape {
	Rectangle,
	RoundedRectangle,
}

/**
 * Image size options for Character images. Correspond to hosted image variants.
 */
export enum CharacterImageSize {
	Full = 'full',
	Profile = 'profile',
	Thumbnail = 'thumbnail',
}

/**
 * Image size options for Faction images. Correspond to hosted image variants.
 */
export enum FactionImageSize {
	Small = 'small',
	Large = 'large',
}

/**
 * Options for image rendering.
 */
export interface ImageOptions {
	// TODO: use Size instead of separate numbers.
	/**
	 * Max image width
	 */
	maxWidthInPixels?: number;
	/**
	 * Max image height
	 */
	maxHeightInPixels?: number;

	/**
	 * Shape of the image container
	 */
	containerShape: ImageContainerShape;
}

export enum CharacterImageVariant {
	Full = 'full',
	Profile = 'profile',
}

/**
 * Options for image rendering.
 */
export interface CharacterImageOptions {
	// TODO: use Size instead of separate numbers.
	/**
	 * Max image width
	 */
	maxWidthInPixels?: number;
	/**
	 * Max image height
	 */
	maxHeightInPixels?: number;

	/**
	 * Shape of the image container
	 */
	containerShape: ImageContainerShape;

	/**
	 * Full or profile image display
	 */
	variant: CharacterImageVariant;
}

/**
 * Renders the emblem for the first faction in the specified list for which an image exists.
 */
export function renderFirstFactionEmblem(
	factionNames: string[],
	options: ImageOptions,
): React.ReactElement {
	const cleanedNames = factionNames.map((factionName) => cleanName(factionName));

	const factionImageUrls: string[] = [];
	cleanedNames.forEach((cleanedName) => {
		const urls = getSizedFactionUrls(`${baseImageUrl}/factions/${cleanedName}`, options);
		factionImageUrls.push(...urls);
	});

	const key = cleanedNames.reduce((aggregate, current) => `${aggregate}-${current}`);

	return loadAndRenderImage(factionImageUrls, options, `${key}-image`);
}

/**
 * Renders the faction image for the specified faction.
 */
export function renderFactionEmblem(
	factionName: string,
	options: ImageOptions,
): React.ReactElement {
	const cleanedName = cleanName(factionName);
	const factionImageUrls = getSizedFactionUrls(
		`${baseImageUrl}/factions/${cleanedName}`,
		options,
	);
	return loadAndRenderImage(factionImageUrls, options, `${cleanedName}-image`);
}

// TODO: timeout on load attempt.
/**
 * Renders the contact image for the specified contact if one exists. Otherwise displays
 * the `missing contact` image.
 */
export function renderCharacterImage(
	character: Character,
	options: CharacterImageOptions,
): React.ReactElement {
	const resourceBaseName = getImageResourceBaseName(character);
	const cleanedName = cleanName(resourceBaseName);
	const contactImageUrls = getSizedCharacterUrl(
		`${baseImageUrl}/contacts/${cleanedName}`,
		options,
	);
	const missingContactImage = 'images/Missing-Contact-Image.png';
	const urls = [contactImageUrls, missingContactImage];
	return loadAndRenderImage(urls, options, `${cleanedName}-image`);
}

// TODO: timeout after some provided time. Stop spinner and display error.
/**
 * Renders the first image found in the list of urls. Multiple images can be used to
 * handle the case where the requested image does not exists, or 404s or what-have-you.
 * Displays a spinner while the image is being loaded.
 */
export function loadAndRenderImage(
	imageUrls: string[],
	options: ImageOptions,
	key: string, // Required. Without it, the component gets confused and will fail to load the image
): React.ReactElement {
	let borderRadius = 0;
	switch (options.containerShape) {
		case ImageContainerShape.RoundedRectangle:
			const minImageDimensionInPixels = getMinImageDimensionInPixels(
				options.maxHeightInPixels,
				options.maxWidthInPixels,
			);
			borderRadius =
				minImageDimensionInPixels === undefined ? 10 : minImageDimensionInPixels / 20;
			break;
		default:
			break;
	}

	// TODO: memory leak if this component is unmounted before image is loaded :(
	return (
		<ReactImage
			src={imageUrls}
			key={key}
			loader={renderLoadingPlaceholder(options.maxHeightInPixels, options.maxWidthInPixels)}
			style={{
				borderRadius,
				maxHeight: options.maxHeightInPixels ?? '100%',
				maxWidth: options.maxWidthInPixels ?? '100%',
			}}
		></ReactImage>
	);
}

/**
 * Renders the spinner, spaced for the image being loaded
 */
function renderLoadingPlaceholder(
	maxHeightInPixels?: number,
	maxWidthInPixels?: number,
): React.ReactElement {
	return (
		<div
			style={{
				minWidth: maxWidthInPixels,
				minHeight: maxHeightInPixels,
				display: 'flex',
				justifyContent: 'center',
				alignContent: 'center',
				alignItems: 'center',
			}}
		>
			<CircularProgress color="primary"></CircularProgress>
		</div>
	);
}

/**
 * Formats the provided name for image url queries. Replaces spaces with hyphens, and stro[s]
 */
export function cleanName(value: string): string {
	// eslint-disable-next-line no-useless-escape
	return value.replace(/\s/g, '-').replace(/[^0-9a-zA-Z_\-]/g, '');
}

/**
 * Gets the suggested image size(s) to query for based on the specified height.
 * Potentially returns multiple sizes, given in the order of recommendation.
 */
function getFactionImageSizes(options: ImageOptions): FactionImageSize[] {
	const maxImageDimensionInPixels = getMaxImageDimensionInPixels(
		options.maxHeightInPixels,
		options.maxWidthInPixels,
	);
	if (maxImageDimensionInPixels === undefined || maxImageDimensionInPixels > 250) {
		return [FactionImageSize.Large, FactionImageSize.Small];
	}
	return [FactionImageSize.Small, FactionImageSize.Large];
}

/**
 * Gets urls for the base url image at different sizes, in order based on size recommendations.
 */
function getSizedFactionUrls(urlBase: string, options: ImageOptions): string[] {
	const recommendedSizes = getFactionImageSizes(options);
	return recommendedSizes.map((size) => `${urlBase}-${size}.png`);
}

/**
 * Gets the suggested image size(s) to query for based on the specified height.
 * Potentially returns multiple sizes, given in the order of recommendation.
 */
function getCharacterImageSize(options: CharacterImageOptions): CharacterImageSize {
	if (options.variant === CharacterImageVariant.Full) {
		return CharacterImageSize.Full;
	}

	const maxImageDimensionInPixels = getMaxImageDimensionInPixels(
		options.maxHeightInPixels,
		options.maxWidthInPixels,
	);
	return maxImageDimensionInPixels === undefined || maxImageDimensionInPixels > 150
		? CharacterImageSize.Profile
		: CharacterImageSize.Thumbnail;
}

/**
 * Gets urls for the base url image at different sizes, in order based on size recommendations.
 */
function getSizedCharacterUrl(urlBase: string, options: CharacterImageOptions): string {
	const size = getCharacterImageSize(options);
	return `${urlBase}-${size}.png`;
}

/**
 * Gets minimum between the width and height
 */
function getMinImageDimensionInPixels(
	maxHeightInPixels?: number,
	maxWidthInPixels?: number,
): number | undefined {
	if (maxHeightInPixels === undefined && maxWidthInPixels === undefined) {
		return undefined;
	}

	if (maxHeightInPixels === undefined) {
		return maxWidthInPixels;
	}

	if (maxWidthInPixels === undefined) {
		return maxHeightInPixels;
	}

	return Math.min(maxHeightInPixels, maxWidthInPixels);
}

/**
 * Gets maximum between the width and height
 */
function getMaxImageDimensionInPixels(
	maxHeightInPixels?: number,
	maxWidthInPixels?: number,
): number | undefined {
	if (maxHeightInPixels === undefined && maxWidthInPixels === undefined) {
		return undefined;
	}

	if (maxHeightInPixels === undefined) {
		return maxWidthInPixels;
	}

	if (maxWidthInPixels === undefined) {
		return maxHeightInPixels;
	}

	return Math.max(maxHeightInPixels, maxWidthInPixels);
}
