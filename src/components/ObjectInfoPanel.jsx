import React from 'react';
import useStore from '../stores/useStore';

const ObjectInfoPanel = () => {
    const { selectedObject, clearSelectedObject, setCameraTarget } = useStore();

    if (!selectedObject) {
        return null;
    }

    const { name, type, icon, color, facts, currentPosition } = selectedObject;

    const handleFlyTo = () => {
        if (currentPosition) {
            setCameraTarget(currentPosition);
        }
    };

    const handleClose = () => {
        clearSelectedObject();
    };

    // Get background color based on object
    const getIconBgColor = () => {
        if (type === 'star') return 'linear-gradient(135deg, #ffa726 0%, #ff7043 100%)';
        if (name === 'Earth') return 'linear-gradient(135deg, #42a5f5 0%, #66bb6a 100%)';
        if (name === 'Mars') return 'linear-gradient(135deg, #ef5350 0%, #ff7043 100%)';
        return `linear-gradient(135deg, ${color || '#6366f1'} 0%, ${color || '#8b5cf6'} 100%)`;
    };

    return (
        <div className="info-panel glass-panel fade-in">
            <button
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    lineHeight: 1,
                }}
            >
                ×
            </button>

            <div className="info-panel-header">
                <div
                    className="info-panel-icon"
                    style={{ background: getIconBgColor() }}
                >
                    {icon}
                </div>
                <div className="info-panel-title">
                    <h2>{name}</h2>
                    <span>{type?.charAt(0).toUpperCase() + type?.slice(1)}</span>
                </div>
            </div>

            {facts && (
                <div className="info-panel-stats">
                    {Object.entries(facts).map(([key, value]) => (
                        <div key={key} className="stat-item">
                            <div className="stat-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                            <div className="stat-value">{value}</div>
                        </div>
                    ))}
                </div>
            )}

            {currentPosition && (
                <button className="fly-to-btn" onClick={handleFlyTo}>
                    🚀 Fly to {name}
                </button>
            )}
        </div>
    );
};

export default ObjectInfoPanel;
