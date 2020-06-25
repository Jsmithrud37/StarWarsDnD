import React, { ReactNode } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {
	AccordionMenuItem,
	AccordionMenuItemBuilder,
	AccordionMenuItemProps,
	AccordionMenuItemStyle,
} from './AccordionMenuItem';

export class CollapsableAccordionMenuItemBuilder extends AccordionMenuItemBuilder {
	private readonly content: JSX.Element;

	public constructor(
		title: string,
		defaultStyle: AccordionMenuItemStyle,
		selectedStyle: AccordionMenuItemStyle,
		content: JSX.Element,
		className?: string,
	) {
		super(title, defaultStyle, selectedStyle, className);
		this.content = content;
	}

	public createMenuItem(selected: boolean, onClick: () => void): ReactNode {
		return (
			<CollapsableAccordionMenuItem
				title={this.title}
				style={this.getStyle(selected)}
				onClick={onClick}
				content={this.content}
			/>
		);
	}
}

export interface CollapsableAccordionMenuItemProps extends AccordionMenuItemProps {
	content: JSX.Element;
}

export class CollapsableAccordionMenuItem extends AccordionMenuItem<
	CollapsableAccordionMenuItemProps,
	{}
> {
	public constructor(props: CollapsableAccordionMenuItemProps) {
		super(props);
	}

	public render(): ReactNode {
		return (
			<div className={this.props.className}>
				<Card
					bg={this.props.style.backgroundColor}
					text={this.props.style.textColor}
					border={this.props.style.borderColor}
				>
					<Accordion.Toggle
						as={Card.Header}
						eventKey={this.props.title}
						onClick={() => this.props.onClick()}
					>
						{this.props.title}
					</Accordion.Toggle>
					<Accordion.Collapse eventKey={this.props.title}>
						<Card>{this.props.content}</Card>
					</Accordion.Collapse>
				</Card>
			</div>
		);
	}
}
