import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
	/**
	 * Text to display with the spinner.
	 */
	text: string;
}

/**
 * Messenger app for the datapad.
 * Simple wrapper around the Discord server.
 */
class LoadingScreen extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render(): React.ReactNode {
		return (
			<div
				style={{
					flex: 1,
					textAlign: 'center',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div
					style={{
						padding: '15px',
					}}
				>
					{this.props.text}
				</div>
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
						<Spinner animation="border" variant="light" />
					</div>
				</div>
			</div>
		);
	}
}

export default LoadingScreen;
