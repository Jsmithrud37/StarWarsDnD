import React, { ReactNode } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { AccordionMenuItemBuilder, AccordionMenuItemStyle } from './AccordionMenuItem';

export interface AccordionMenuState {
	selectionIndex: number;
}

export interface AccordionMenuProps {
	initialSelectionIndex: number;
	onSelectionChange: (selectionIndex: number) => void;
	menuItemBuilders: AccordionMenuItemBuilder[];
	defaultItemStyle: AccordionMenuItemStyle;
	selectedItemStyle: AccordionMenuItemStyle;
}

export class AccordionMenu extends React.Component<AccordionMenuProps, AccordionMenuState> {
	constructor(props: AccordionMenuProps) {
		super(props);
		this.state = { selectionIndex: props.initialSelectionIndex };
	}

	private get itemCount(): number {
		return this.props.menuItemBuilders.length;
	}

	private setSelection(newSelectionIndex: number): void {
		if (newSelectionIndex >= this.itemCount) {
			throw new Error(
				`Selection index out of bounds.` +
					`${newSelectionIndex} is outside of valid range: [0, ${this.itemCount})`,
			);
		}
		this.setState({
			selectionIndex: newSelectionIndex,
		});
		this.props.onSelectionChange(newSelectionIndex);
	}

	private isSelected(index: number): boolean {
		return index === this.state.selectionIndex;
	}

	public render(): ReactNode {
		// Generate menu items from props
		const itemCount = this.itemCount;
		const menuItems: ReactNode[] = [];
		for (let i = 0; i < itemCount; i++) {
			const element: ReactNode = (
				<React.Fragment key={i}>
					{this.props.menuItemBuilders[i].createMenuItem(
						i === this.state.selectionIndex,
						() => this.setSelection(i),
					)}
				</React.Fragment>
			);
			menuItems.push(element);
		}

		return (
			<Accordion
				className="Datapad-menu"
				defaultActiveKey={this.props.menuItemBuilders[0].title}
			>
				{menuItems.map((item) => {
					return item;
				})}
			</Accordion>
		);
	}
}
