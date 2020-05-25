import { CardColors } from '../../BootstrapUtilities';
import React, { ReactNode } from 'react';

export interface AccordionMenuItemStyle {
	backgroundColor: CardColors;
	textColor: CardColors;
	borderColor: CardColors;
}

export abstract class AccordionMenuItemBuilder {
	public readonly title: string;

	protected constructor(title: string) {
		this.title = title;
	}

	public abstract createMenuItem(style: AccordionMenuItemStyle, onClick: () => void): ReactNode;
}

export interface AccordionMenuItemProps {
	title: string;
	style: AccordionMenuItemStyle;
	onClick: () => void;
}

export class AccordionMenuItem<TProps extends AccordionMenuItemProps> extends React.Component<
	TProps
> {
	protected constructor(props: TProps) {
		super(props);
	}
}