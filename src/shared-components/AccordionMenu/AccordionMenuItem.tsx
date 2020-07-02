import React, { ReactNode } from 'react';
import { CardColors } from '../../BootstrapUtilities';

export interface AccordionMenuItemStyle {
	backgroundColor: CardColors;
	textColor: CardColors;
	borderColor: CardColors;
}

export abstract class AccordionMenuItemBuilder {
	public readonly title: string;
	public readonly defaultCardStyle: AccordionMenuItemStyle;
	public readonly selectedCardStyle: AccordionMenuItemStyle;
	public readonly className?: string;

	protected getStyle(selected: boolean): AccordionMenuItemStyle {
		return selected ? this.selectedCardStyle : this.defaultCardStyle;
	}

	protected constructor(
		title: string,
		defaultCardStyle: AccordionMenuItemStyle,
		selectedCardStyle: AccordionMenuItemStyle,
		className?: string,
	) {
		this.title = title;
		this.defaultCardStyle = defaultCardStyle;
		this.selectedCardStyle = selectedCardStyle;
		this.className = className;
	}

	public abstract createMenuItem(selected: boolean, onClick: () => void): ReactNode;
}

export interface AccordionMenuItemProps {
	title: string;
	style: AccordionMenuItemStyle;
	onClick: () => void;
	className?: string;
}

export class AccordionMenuItem<
	TProps extends AccordionMenuItemProps,
	TState extends {}
> extends React.Component<TProps, TState> {
	protected constructor(props: TProps) {
		super(props);
	}
}
