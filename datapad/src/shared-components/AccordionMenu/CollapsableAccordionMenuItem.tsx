import React from 'react';
import Accordion from 'react-bootstrap/accordion';
import Card from 'react-bootstrap/card';
import {
	AccordionMenuItem,
	AccordionMenuItemProps,
	AccordionMenuItemBuilder,
	AccordionMenuItemStyle,
} from './AccordionMenuItem';

export class CollapsableAccordionMenuItemBuilder extends AccordionMenuItemBuilder {
	private readonly content: any;

	public constructor(title: string, content: any) {
		super(title);
		this.content = content;
	}

	public createMenuItem(style: AccordionMenuItemStyle, onClick: () => void): JSX.Element {
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
	content: any;
}

export class CollapsableAccordionMenuItem extends AccordionMenuItem<
	CollapsableAccordionMenuItemProps
> {
	public constructor(props: CollapsableAccordionMenuItemProps) {
		super(props);
	}

	get content(): any {
		return (this.props as CollapsableAccordionMenuItemProps).content;
	}

	render() {
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
					<Card>{this.content}</Card>
				</Accordion.Collapse>
			</Card>
		);
	}
}
