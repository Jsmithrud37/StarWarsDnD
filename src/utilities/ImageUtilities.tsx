/**
 * Utilities for interacting with image cloud storage
 */

import React from 'react';
import { Img as ReactImage } from 'react-image';
import { CircularProgress } from '@material-ui/core';

const baseImageUrl = 'https://datapadassets.blob.core.windows.net';

/**
 * Shape options for image cropping.
 */
export enum ImageContainerShape {
	Rectangle,
	RoundedRectangle,
}

/**
 * Image size options. Correspond to hosted image variants.
 */
export enum ImageSize {
	Small = 'small',
	Medium = 'medium',
	Large = 'large',
}

/**
 * Options for image rendering.
 */
export interface ImageOptions {
	/**
	 * Max applied to both width and height
	 */
	maxImageDimensionInPixels: number;
	containerShape: ImageContainerShape;
}

/**
 * Renders the contact image for the specified contact if one exists. Otherwise displays
 * the `missing contact` image.
 */
export function renderFactionEmblem(factionName: string, options: ImageOptions): React.ReactNode {
	const cleanedName = cleanName(factionName);
	const factionImageUrls = getSizedUrls(`${baseImageUrl}/factions/${cleanedName}`, options);
	return loadAndRenderImage(factionImageUrls, options);
}

// TODO: timeout on load attempt.
/**
 * Renders the faction image for the specified faction.
 * Assumes that one exists, if it doesn't, this will fail to converge.
 */
export function renderContactImage(contactName: string, options: ImageOptions): React.ReactNode {
	const cleanedName = cleanName(contactName);
	const contactImageUrls = getSizedUrls(`${baseImageUrl}/contacts/${cleanedName}`, options);
	const missingContactImage = 'images/Missing-Contact-Image.png';
	const urls = [...contactImageUrls, missingContactImage];
	return loadAndRenderImage(urls, options);
}

// TODO: timeout after some provided time. Stop spinner and display error.
/**
 * Renders the first image found in the list of urls. Multiple images can be used to
 * handle the case where the requested image does not exists, or 404s or what-have-you.
 * Displays a spinner while the image is being loaded.
 */
export function loadAndRenderImage(imageUrls: string[], options: ImageOptions): React.ReactNode {
	let borderRadius = 0;
	switch (options.containerShape) {
		case ImageContainerShape.RoundedRectangle:
			borderRadius = options.maxImageDimensionInPixels / 10;
			break;
		default:
			break;
	}

	// TODO: memory leak if this component is unmounted before image is loaded :(
	return (
		<ReactImage
			src={imageUrls}
			loader={<CircularProgress color="primary"></CircularProgress>}
			style={{
				borderRadius,
				maxHeight: options.maxImageDimensionInPixels,
				maxWidth: options.maxImageDimensionInPixels,
			}}
		></ReactImage>
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
function getImageSizes(options: ImageOptions): ImageSize[] {
	if (options.maxImageDimensionInPixels > 500) {
		return [ImageSize.Large, ImageSize.Medium, ImageSize.Small];
	}
	if (options.maxImageDimensionInPixels > 250) {
		return [ImageSize.Medium, ImageSize.Large, ImageSize.Small];
	}
	return [ImageSize.Small, ImageSize.Medium, ImageSize.Large];
}

/**
 * Gets urls for the base url image at different sizes, in order based on size recommendations.
 */
function getSizedUrls(urlBase: string, options: ImageOptions): string[] {
	const recommendedSizes = getImageSizes(options);
	return recommendedSizes.map((size) => `${urlBase}-${size}.png`);
}
