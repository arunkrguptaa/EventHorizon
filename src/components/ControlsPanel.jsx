import React from 'react';
import useStore from '../stores/useStore';

const ControlsPanel = () => {
    const {
        showOrbits,
        toggleOrbits,
        showPerformanceMonitor,
        togglePerformanceMonitor,
        isPaused,
        togglePause,
        timeScale,
        setTimeScale
    } = useStore();

    return (
        <div className="controls-panel glass-panel">
            <p>🖱️ Drag to rotate</p>
            <p>🔍 Scroll to zoom</p>
            <p>🌟 10,000+ Stars</p>

            <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--color-border)'
            }}>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginBottom: '8px'
                }}>
                    <input
                        type="checkbox"
                        checked={showOrbits}
                        onChange={toggleOrbits}
                        style={{ cursor: 'pointer' }}
                    />
                    Show orbits
                </label>

                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginBottom: '8px'
                }}>
                    <input
                        type="checkbox"
                        checked={isPaused}
                        onChange={togglePause}
                        style={{ cursor: 'pointer' }}
                    />
                    Pause motion
                </label>

                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginBottom: '8px'
                }}>
                    <input
                        type="checkbox"
                        checked={showPerformanceMonitor}
                        onChange={togglePerformanceMonitor}
                        style={{ cursor: 'pointer' }}
                    />
                    Show FPS
                </label>

                <div style={{ marginTop: '8px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)'
                    }}>
                        Orbit Speed: {timeScale}x
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={timeScale}
                        onChange={(e) => setTimeScale(Number(e.target.value))}
                        style={{
                            width: '100%',
                            cursor: 'pointer',
                            accentColor: 'var(--color-accent-primary)'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ControlsPanel;
