import React from 'react';
import Datapad from './Datapad';
import './App.css';

/**
 * Entrypoint to the application. Outermost container.
 */
const App: React.FC = () => {
	return (
		<body className="App">
			<header className="App-header">
				<img
					src="images/Order-Of-The-Fallen-Logo-Long.png"
					className="Campaign-logo"
					alt="Campaign logo"
					height="75"
				/>
				<a className="App-link" href="https://sw5e.com/" target="_blank" rel="noopener noreferrer">
					<img
						src="https://sw5e.com/img/sw5e-logo.84b4d7ed.png"
						className="SW5e-logo"
						alt="SW5e logo"
						height="75"
					/>
				</a>
			</header>
			<body className="App-container">
				<Datapad />
			</body>
		</body>
	);
};

export default App;
