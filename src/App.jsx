import React from 'react';
import Universe from './components/Universe';
import SearchPanel from './components/SearchPanel';
import ObjectInfoPanel from './components/ObjectInfoPanel';
import ControlsPanel from './components/ControlsPanel';
import PerformanceMonitor from './components/PerformanceMonitor';
import ScaleIndicator from './components/ScaleIndicator';
import AmbientAudio from './components/AmbientAudio';

const App = () => {
    return (
        <div className="app-container">
            {/* 3D Universe Canvas */}
            <Universe />

            {/* UI Overlay Layer */}
            <div className="ui-layer">
                {/* Header / Branding */}
                <div className="header-panel glass-panel">
                    <h1>Event Horizon</h1>
                    <p className="subtitle">Universe Navigator</p>
                </div>

                {/* Scale Indicator / Breadcrumbs */}
                <ScaleIndicator />

                {/* Search Panel */}
                <SearchPanel />

                {/* Selected Object Info */}
                <ObjectInfoPanel />

                {/* Controls Help */}
                <ControlsPanel />

                {/* Performance Monitor */}
                <PerformanceMonitor />

                {/* Ambient Audio Controls */}
                <AmbientAudio />
            </div>
        </div>
    );
};

export default App;
