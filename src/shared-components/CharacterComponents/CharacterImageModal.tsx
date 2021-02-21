import React from 'react';
import { Character } from '../../characters';
import {
	CharacterImageVariant,
	ImageContainerShape,
	renderCharacterImage,
} from '../../utilities/ImageUtilities';

/**
 * Props for {@link CharacterImageForModal}
 */
export interface CharacterImageModalProps {
	character: Character;
}

/**
 * Renders a nearly full-screen render of the image for the specified character, centered over the
 * screen. Intended to be used in a Modal.
 */
export function CharacterImageForModal(props: CharacterImageModalProps): React.ReactElement {
	const scalar = 0.85;
	const maxWidth = scalar * window.innerWidth;
	const maxHeight = scalar * window.innerHeight;
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				transform: 'translate(-50%, -50%)',
			}}
		>
			{renderCharacterImage(props.character.name, {
				maxWidthInPixels: maxWidth,
				maxHeightInPixels: maxHeight,
				containerShape: ImageContainerShape.RoundedRectangle,
				variant: CharacterImageVariant.Full,
			})}
		</div>
	);
}
