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
	Small = 'small', // TODO: "thumbnail"
	Large = 'large', // TODO: "full"
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

/**
 * Renders the faction image for the specified faction.
 * Assumes that one exists, if it doesn't, this will fail to converge.
 */
export function renderFactionEmblem(
	factionName: string,
	options: ImageOptions,
): React.ReactElement {
	const cleanedName = cleanName(factionName);
	const factionImageUrls = getSizedUrls(`${baseImageUrl}/factions/${cleanedName}`, options);
	return loadAndRenderImage(factionImageUrls, options);
}

// TODO: timeout on load attempt.
/**
 * Renders the contact image for the specified contact if one exists. Otherwise displays
 * the `missing contact` image.
 */
export function renderContactImage(contactName: string, options: ImageOptions): React.ReactElement {
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
export function loadAndRenderImage(imageUrls: string[], options: ImageOptions): React.ReactElement {
	let borderRadius = 0;
	switch (options.containerShape) {
		case ImageContainerShape.RoundedRectangle:
			const minImageDimensionInPixels = getMinImageDimensionInPixels(options);
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
			loader={renderLoadingPlaceholder(options)}
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
function renderLoadingPlaceholder(options: ImageOptions): React.ReactElement {
	return (
		<div
			style={{
				minWidth: options.maxWidthInPixels,
				minHeight: options.maxHeightInPixels,
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
function getImageSizes(options: ImageOptions): ImageSize[] {
	const maxImageDimensionInPixels = getMaxImageDimensionInPixels(options);
	if (maxImageDimensionInPixels === undefined || maxImageDimensionInPixels > 250) {
		return [ImageSize.Large, ImageSize.Small];
	}
	return [ImageSize.Small, ImageSize.Large];
}

/**
 * Gets urls for the base url image at different sizes, in order based on size recommendations.
 */
function getSizedUrls(urlBase: string, options: ImageOptions): string[] {
	const recommendedSizes = getImageSizes(options);
	return recommendedSizes.map((size) => `${urlBase}-${size}.png`);
}

/**
 * Gets minimum between the width and height
 */
function getMinImageDimensionInPixels(options: ImageOptions): number | undefined {
	if (options.maxHeightInPixels === undefined && options.maxWidthInPixels === undefined) {
		return undefined;
	}

	if (options.maxHeightInPixels === undefined) {
		return options.maxWidthInPixels;
	}

	if (options.maxWidthInPixels === undefined) {
		return options.maxHeightInPixels;
	}

	return Math.min(options.maxHeightInPixels, options.maxWidthInPixels);
}

/**
 * Gets maximum between the width and height
 */
function getMaxImageDimensionInPixels(options: ImageOptions): number | undefined {
	if (options.maxHeightInPixels === undefined && options.maxWidthInPixels === undefined) {
		return undefined;
	}

	if (options.maxHeightInPixels === undefined) {
		return options.maxWidthInPixels;
	}

	if (options.maxWidthInPixels === undefined) {
		return options.maxHeightInPixels;
	}

	return Math.max(options.maxHeightInPixels, options.maxWidthInPixels);
}
