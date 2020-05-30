import React, { ReactNode } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Datapad, { reducers } from './Datapad';
import './App.css';

const dataStore = createStore(reducers);

/**
 * Entrypoint to the application. Outermost container.
 */
export class App extends React.Component {
	public render(): ReactNode {
		return (
			<div className="App">
				<header className="App-header">
					<img
						src="images/Order-Of-The-Fallen-Logo-Long.png"
						className="Campaign-logo"
						alt="Campaign logo"
						height="75"
					/>
					<div>Datapad</div>
					<a
						className="App-link"
						href="https://sw5e.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="https://sw5e.com/img/sw5e-logo.84b4d7ed.png"
							className="SW5e-logo"
							alt="SW5e logo"
							height="75"
						/>
					</a>
				</header>
				<div className="App-container">
					<Provider store={dataStore}>
						<Datapad />
					</Provider>
				</div>
			</div>
		);
	}
}

export default App;
