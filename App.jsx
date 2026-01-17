import React from 'react';
import StarField from './components/StarField';
import './App.css';

const App = () => {
    return (
        <div className="app-container">
            <StarField />
            <div className="ui-panel">
                <h1>Event Horizon</h1>
                <p className="subtitle">Universe Navigator</p>
                <div className="controls">
                    <p>🖱️ Scroll to zoom</p>
                    <p>🌟 10,000 Stars</p>
                </div>
            </div>
        </div>
    );
};

export default App;