import React from 'react';
import './App.css';

/**
 * Entrypoint to the application. Outermost container.
 */
const App: React.FC = () => {
	return (
		<div className="App">
			<div className="stars">
				<header className="App-header">
					<img
						src="images/Order-Of-The-Fallen-Logo-Long.png"
						className="Campaign-logo"
						alt="Campaign logo"
						height="100"
					/>
					<a className="App-link" href="https://sw5e.com/" target="_blank" rel="noopener noreferrer">
						<img
							src="https://sw5e.com/img/sw5e-logo.84b4d7ed.png"
							className="SW5e-logo"
							alt="SW5e logo"
							height="100"
						/>
					</a>
				</header>
			</div>
		</div>
	);
};

export default App;
