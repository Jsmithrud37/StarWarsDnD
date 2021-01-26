import React from 'react';
import { CircularProgress } from '@material-ui/core';

interface Props {
	/**
	 * Text to display with the spinner.
	 */
	text?: string;
}

/**
 * Simple loading screen component
 */
class LoadingScreen extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render(): React.ReactNode {
		const textDiv = this.props.text ? (
			<div
				style={{
					padding: '15px',
				}}
			>
				{this.props.text}
			</div>
		) : (
			React.Fragment
		);

		const spinnerDiv = (
			<div
				style={{
					padding: '15px',
					textAlign: 'center',
				}}
			>
				<div
					style={{
						display: 'inline-block',
					}}
				>
					<CircularProgress color="primary" />
				</div>
			</div>
		);

		return (
			<div
				style={{
					flex: 1,
					textAlign: 'center',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{textDiv}
				{spinnerDiv}
			</div>
		);
	}
}

export default LoadingScreen;
