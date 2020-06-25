import React, { ReactNode } from 'react';
import { CardColors } from '../../BootstrapUtilities';

export interface AccordionMenuItemStyle {
	backgroundColor: CardColors;
	textColor: CardColors;
	borderColor: CardColors;
}

export abstract class AccordionMenuItemBuilder {
	public readonly title: string;
	public readonly defaultStyle: AccordionMenuItemStyle;
	public readonly selectedStyle: AccordionMenuItemStyle;

	protected getStyle(selected: boolean): AccordionMenuItemStyle {
		return selected ? this.selectedStyle : this.defaultStyle;
	}

	protected constructor(
		title: string,
		defaultStyle: AccordionMenuItemStyle,
		selectedStyle: AccordionMenuItemStyle,
	) {
		this.title = title;
		this.defaultStyle = defaultStyle;
		this.selectedStyle = selectedStyle;
	}

	public abstract createMenuItem(selected: boolean, onClick: () => void): ReactNode;
}

export interface AccordionMenuItemProps {
	title: string;
	style: AccordionMenuItemStyle;
	onClick: () => void;
}

export class AccordionMenuItem<
	TProps extends AccordionMenuItemProps,
	TState extends {}
> extends React.Component<TProps, TState> {
	protected constructor(props: TProps) {
		super(props);
	}
}
