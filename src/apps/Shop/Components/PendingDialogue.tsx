import { Card } from '@material-ui/core';
import React from 'react';
import LoadingScreen from '../../../shared-components/LoadingScreen';
import { background2 } from '../../../Theming';

/**
 * Loading screen dialogue displayed while waiting for edits to be submitted to the backend
 */
export class PendingDialogue extends React.Component {
	public constructor(props: {}) {
		super(props);
	}

	public render(): React.ReactNode {
		return (
			<Card
				style={{
					backgroundColor: background2,
					maxWidth: '400px',
				}}
			>
				<LoadingScreen />
			</Card>
		);
	}
}
