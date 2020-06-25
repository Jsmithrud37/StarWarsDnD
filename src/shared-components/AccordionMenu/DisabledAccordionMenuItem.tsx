import React, { ReactNode } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {
	AccordionMenuItem,
	AccordionMenuItemBuilder,
	AccordionMenuItemProps,
	AccordionMenuItemStyle,
} from './AccordionMenuItem';

export class DisabledAccordionMenuItemBuilder extends AccordionMenuItemBuilder {
	/**
	 * Replacement text to display when the item is hovered over.
	 */
	public readonly hoverOverText: string;

	public constructor(title: string, style: AccordionMenuItemStyle, hoverOverText: string) {
		super(title, style, style);
		this.hoverOverText = hoverOverText;
	}

	public createMenuItem(selected: boolean, onClick: () => void): ReactNode {
		return (
			<DisabledAccordionMenuItem
				title={this.title}
				style={this.defaultStyle}
				onClick={onClick}
				hoverOverText={this.hoverOverText}
			/>
		);
	}
}

interface DisabledAccordionMenuItemProps extends AccordionMenuItemProps {
	/**
	 * Hover text for disabled menu items
	 */
	hoverOverText: string;
}

interface State {
	/**
	 * True iff the menu item is hovered over.
	 */
	hovered: boolean;
}

export class DisabledAccordionMenuItem extends AccordionMenuItem<
	DisabledAccordionMenuItemProps,
	State
> {
	public constructor(props: DisabledAccordionMenuItemProps) {
		super(props);
		this.state = { hovered: false };
	}

	public render(): ReactNode {
		return (
			<div
				onMouseEnter={() => this.setHovered(true)}
				onMouseLeave={() => this.setHovered(false)}
			>
				<Card
					bg={this.props.style.backgroundColor}
					text={this.props.style.textColor}
					border={this.props.style.borderColor}
				>
					<Accordion.Toggle
						as={Card.Header}
						eventKey={this.props.title}
						onClick={onClick}
					>
						{this.state.hovered ? this.props.hoverOverText : this.props.title}
					</Accordion.Toggle>
				</Card>
			</div>
		);
	}

	private setHovered(hovered: boolean): void {
		this.setState({
			...this.state,
			hovered,
		});
	}
}

/**
 * onClick implementation for DisabledAccordionMenuItem
 */
function onClick(): void {
	/**
	 * NoOp
	 */
}
