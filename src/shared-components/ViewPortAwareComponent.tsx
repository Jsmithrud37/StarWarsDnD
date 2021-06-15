import React from 'react';

/**
 * Props base for use with {@link ViewPortAwareComponent}
 */
export interface ViewPortAwareState {
	/**
	 * Width of the viewport in pixels.
	 * Used for image modal display.
	 */
	viewportWidthInPixels: number;

	/**
	 * Width of the viewport in pixels.
	 * Used for image modal display.
	 */
	viewportHeightInPixels: number;
}

/**
 * Base class for components that need to be viewport-dimension aware
 */
export abstract class ViewPortAwareComponent<
	P = {},
	S extends ViewPortAwareState = ViewPortAwareState,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	SS = any,
> extends React.Component<P, S, SS> {
	protected constructor(props: P) {
		super(props);
	}

	/**
	 * {@inheritdoc React.Component.componentDidMount}
	 */
	public componentDidMount(): void {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions.bind(this));
	}

	/**
	 * {@inheritdoc React.Component.componentWillUnmount}
	 */
	public componentWillUnmount(): void {
		window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
	}

	private updateWindowDimensions(): void {
		this.setState({
			...this.state,
			viewportWidthInPixels: window.innerWidth,
			viewportHeightInPixels: window.innerHeight,
		});
	}
}

export default ViewPortAwareComponent;
