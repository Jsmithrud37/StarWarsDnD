import { Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import React from 'react';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { background3 } from '../../../Theming';
import { Contact } from '../Contact';
import { ContactDetails } from './ContactDetails';
import { ImageContainerShape, renderContactImage } from '../../../utilities/ImageUtilities';

const contactCardHeaderHeightInPixels = 100;
const contactCardBodyHeightInPixels = 450;

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
					minWidth: 360,
					maxWidth: 500,
					overflow: 'hidden',
					backgroundColor: background3,
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
		const name = this.renderName();
		const imageHeightInPixels = 60;

		// Only display the contact image when the card is not expanded
		const contactImage = renderContactImage(this.props.contact.name, {
			displayHeightInPixels: imageHeightInPixels,
			containerShape: ImageContainerShape.RoundedRectangle,
		});

		const burgerButton = (
			<HamburgerSqueeze
				barColor="white"
				buttonWidth={30}
				isActive={this.props.selected}
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
					<Collapse in={!this.props.selected} timeout={150}>
						{contactImage}
					</Collapse>
				}
				title={name}
				action={burgerButton}
				style={{
					height: `${contactCardHeaderHeightInPixels}px`,
				}}
			></CardHeader>
		);
	}

	private renderName(): React.ReactNode {
		return (
			<h5
				style={{
					minWidth: 100,
				}}
			>
				{this.props.contact.name}
			</h5>
		);
	}
}
