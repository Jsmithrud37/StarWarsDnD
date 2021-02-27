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
	renderFirstFactionEmblem,
} from '../../../utilities/ImageUtilities';
import { getSummaryOrTitle } from '../../../characters';

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

		const maxImageDimensionInPixels = 75;

		const imageOptions: CharacterImageOptions = {
			maxWidthInPixels: maxImageDimensionInPixels,
			maxHeightInPixels: maxImageDimensionInPixels,
			containerShape: ImageContainerShape.RoundedRectangle,
			variant: CharacterImageVariant.Profile,
		};

		// Display the contact image when not selected, the faction emblem when selected
		const maybeAvatarImage = isSelected
			? this.props.contact.affiliations
				? renderFirstFactionEmblem(this.props.contact.affiliations, imageOptions)
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

		const burgerButtonDiv = (
			<div
				style={{
					height: maxImageDimensionInPixels,
					width: maxImageDimensionInPixels,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				{burgerButton}
			</div>
		);

		const summary = getSummaryOrTitle(this.props.contact);

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
				title={this.props.contact.name}
				titleTypographyProps={{
					variant: 'h5',
				}}
				subheader={summary}
				action={burgerButtonDiv}
				style={{
					height: `${contactCardHeaderHeightInPixels}px`,
				}}
			></CardHeader>
		);
	}
}
