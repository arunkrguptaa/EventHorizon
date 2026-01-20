import React from 'react';
import useStore from '../stores/useStore';

const PerformanceMonitor = () => {
    const { fps, objectCount, showPerformanceMonitor } = useStore();

    if (!showPerformanceMonitor) return null;

    return (
        <div className="perf-monitor glass-panel">
            <span className="fps">{fps} FPS</span>
            <span className="objects">| {objectCount.toLocaleString()} objects</span>
        </div>
    );
};

export default PerformanceMonitor;
