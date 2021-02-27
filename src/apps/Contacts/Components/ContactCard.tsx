import { Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import React from 'react';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { createContentColorForLevel } from '../../../Theming';
import { Contact, getContactCardColor } from '../Contact';
import { ContactDetails } from './ContactDetails';
import {
	CharacterImageOptions,
	CharacterImageVariant,
	ImageContainerShape,
	renderCharacterImage,
	renderFactionEmblem,
} from '../../../utilities/ImageUtilities';
import { getMaybeFirstFactionAffiliation, getSummaryOrTitle } from '../../../characters';

const contactCardHeaderHeightInPixels = 100;
const contactCardBodyHeightInPixels = 470;

export interface ContactCardProps {
	contact: Contact;
	selected: boolean;
	onToggleSelection: () => void;
}

export class ContactCard extends React.Component<ContactCardProps> {
	public constructor(props: ContactCardProps) {
		super(props);
	}

	public render(): React.ReactNode {
		const cardHeader = this.renderContactCardHeader();
		return (
			<Card
				onClick={(event) => {
					// Ensures that deselect event capture on container
					// does not immediately deselect the contact.
					event.stopPropagation();
					if (!this.props.selected) {
						this.props.onToggleSelection();
					}
				}}
				raised={this.props.selected}
				style={{
					overflow: 'hidden',
					backgroundColor: createContentColorForLevel(
						getContactCardColor(this.props.contact),
						3,
					),
				}}
			>
				{cardHeader}
				<Collapse in={this.props.selected}>
					<CardContent>
						<ContactDetails
							contact={this.props.contact}
							heightInPixels={contactCardBodyHeightInPixels}
						/>
					</CardContent>
				</Collapse>
			</Card>
		);
	}

	private renderContactCardHeader(): React.ReactNode {
		const isSelected = this.props.selected;

		const name = this.renderNameAndTitle();
		const maxImageDimensionInPixels = 75;

		const imageOptions: CharacterImageOptions = {
			maxWidthInPixels: maxImageDimensionInPixels,
			maxHeightInPixels: maxImageDimensionInPixels,
			containerShape: ImageContainerShape.RoundedRectangle,
			variant: CharacterImageVariant.Profile,
		};

		// TODO: When attempting to render faction, it gets spinner indefinitely until
		// retrying to render the same emblem again...

		const maybeFaction = getMaybeFirstFactionAffiliation(this.props.contact);

		// Display the contact image when not selected, the faction emblem when selected
		const maybeAvatarImage = isSelected
			? maybeFaction
				? renderFactionEmblem(maybeFaction, imageOptions)
				: React.Fragment
			: renderCharacterImage(this.props.contact, imageOptions);

		const burgerButton = (
			<HamburgerSqueeze
				barColor="white"
				buttonWidth={30}
				isActive={isSelected}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				toggleButton={(event: any) => {
					// Ensures that deselect event capture on container
					// does not immediately deselect the contact.
					event.stopPropagation();
					this.props.onToggleSelection();
				}}
			/>
		);

		return (
			<CardHeader
				avatar={
					<div
						style={{
							height: maxImageDimensionInPixels,
							width: maxImageDimensionInPixels,
						}}
					>
						{maybeAvatarImage}
					</div>
				}
				title={name}
				action={burgerButton}
				style={{
					height: `${contactCardHeaderHeightInPixels}px`,
				}}
			></CardHeader>
		);
	}

	private renderNameAndTitle(): React.ReactNode {
		return (
			<div
				style={{
					minWidth: 100,
					whiteSpace: 'normal',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}}
			>
				{this.renderName()}
				{this.renderSummary()}
			</div>
		);
	}

	private renderName(): React.ReactNode {
		const nameToRender = this.props.contact.shortName ?? this.props.contact.name;
		return (
			<h5
				style={{
					whiteSpace: 'normal',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}}
			>
				{nameToRender}
			</h5>
		);
	}

	private renderSummary(): React.ReactNode {
		const summaryString = getSummaryOrTitle(this.props.contact);
		if (summaryString) {
			return (
				<h6
					style={{
						whiteSpace: 'normal',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					{summaryString}
				</h6>
			);
		}
		return React.Fragment;
	}
}
