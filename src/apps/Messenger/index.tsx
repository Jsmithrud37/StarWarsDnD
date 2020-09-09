import React from 'react';
import WidgetBot from '@widgetbot/react-embed';

const serverId = '497633093394366464';
const generalChannelId = '497633093394366466';

/**
 * Messenger app for the datapad.
 * Simple wrapper around the Discord server.
 */
class MessengerApp extends React.Component {
	public constructor(props: {}) {
		super(props);
	}

	public render(): React.ReactNode {
		return (
			<>
				<WidgetBot
					style={{
						width: '100%',
						height: '100%',
					}}
					defer={false}
					server={serverId}
					channel={generalChannelId}
				/>
			</>
		);
	}
}

export default MessengerApp;
