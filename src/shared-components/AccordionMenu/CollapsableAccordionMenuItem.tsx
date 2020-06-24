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

	public constructor(title: string, content: JSX.Element) {
		super(title);
		this.content = content;
	}

	public createMenuItem(style: AccordionMenuItemStyle, onClick: () => void): ReactNode {
		return (
			<CollapsableAccordionMenuItem
				title={this.title}
				style={style}
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
	CollapsableAccordionMenuItemProps
> {
	public constructor(props: CollapsableAccordionMenuItemProps) {
		super(props);
	}

	public render(): ReactNode {
		return (
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
		);
	}
}
