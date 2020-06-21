import React, { ReactNode } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {
	AccordionMenuItem,
	AccordionMenuItemBuilder,
	AccordionMenuItemProps,
	AccordionMenuItemStyle,
} from './AccordionMenuItem';

export class SimpleAccordionMenuItemBuilder extends AccordionMenuItemBuilder {
	public constructor(title: string) {
		super(title);
	}

	public createMenuItem(style: AccordionMenuItemStyle, onClick: () => void): ReactNode {
		return <SimpleAccordionMenuItem title={this.title} style={style} onClick={onClick} />;
	}
}

export class SimpleAccordionMenuItem extends AccordionMenuItem<AccordionMenuItemProps> {
	public constructor(props: AccordionMenuItemProps) {
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
			</Card>
		);
	}
}
