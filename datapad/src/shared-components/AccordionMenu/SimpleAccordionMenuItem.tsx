import React from 'react';
import Card from 'react-bootstrap/card';
import {
	AccordionMenuItem,
	AccordionMenuItemProps,
	AccordionMenuItemBuilder,
	AccordionMenuItemStyle,
} from './AccordionMenuItem';
import Accordion from 'react-bootstrap/accordion';

export class SimpleAccordionMenuItemBuilder extends AccordionMenuItemBuilder {
	public constructor(title: string) {
		super(title);
	}

	public createMenuItem(style: AccordionMenuItemStyle, onClick: () => void): JSX.Element {
		return <SimpleAccordionMenuItem title={this.title} style={style} onClick={onClick} />;
	}
}

export class SimpleAccordionMenuItem extends AccordionMenuItem<AccordionMenuItemProps> {
	public constructor(props: AccordionMenuItemProps) {
		super(props);
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
			</Card>
		);
	}
}
