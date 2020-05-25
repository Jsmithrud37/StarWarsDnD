import React from 'react';
import Accordion from 'react-bootstrap/accordion';
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

export class AccordionMenu extends React.Component<AccordionMenuProps, AccordionMenuState, any> {
	constructor(props: AccordionMenuProps) {
		super(props);
		this.state = { selectionIndex: props.initialSelectionIndex };
	}

	private get itemCount(): number {
		return this.props.menuItemBuilders.length;
	}

	private setSelection(newSelectionIndex: number) {
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

	public render() {
		// Generate menu items from props
		const itemCount = this.itemCount;
		const menuItems: JSX.Element[] = [];
		for (let i = 0; i < itemCount; i++) {
			const itemStyle =
				i === this.state.selectionIndex
					? this.props.selectedItemStyle
					: this.props.defaultItemStyle;

			menuItems.push(
				this.props.menuItemBuilders[i].createMenuItem(itemStyle, () =>
					this.setSelection(i),
				),
			);
		}

		return (
			<Accordion className="Datapad-menu">
				{menuItems.map((item) => {
					return item;
				})}
			</Accordion>
		);
	}
}
