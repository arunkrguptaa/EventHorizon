import React from 'react';
import useStore, { SCALES } from '../stores/useStore';
import { getGalaxyById } from '../data/galaxyData';
import { getCelestialObjectById } from '../data/celestialData';

const ScaleIndicator = () => {
    const { currentScale, currentLocation, navigateTo, navigateBack } = useStore();

    // Build breadcrumb path
    const getBreadcrumbs = () => {
        const crumbs = [
            { label: 'Universe', scale: SCALES.UNIVERSE, icon: '🌌' }
        ];

        if (currentScale !== SCALES.UNIVERSE) {
            const galaxy = currentLocation.galaxyId
                ? getGalaxyById(currentLocation.galaxyId)
                : { name: 'Milky Way', icon: '🌀' };
            crumbs.push({
                label: galaxy?.name || 'Galaxy',
                scale: SCALES.GALAXY,
                icon: galaxy?.icon || '🌀'
            });
        }

        if (currentScale === SCALES.SOLAR_SYSTEM || currentScale === SCALES.PLANET) {
            crumbs.push({
                label: 'Solar System',
                scale: SCALES.SOLAR_SYSTEM,
                icon: '☀️'
            });
        }

        if (currentScale === SCALES.PLANET && currentLocation.planetId) {
            const planet = getCelestialObjectById(currentLocation.planetId);
            crumbs.push({
                label: planet?.name || 'Planet',
                scale: SCALES.PLANET,
                icon: planet?.icon || '🌍'
            });
        }

        return crumbs;
    };

    const breadcrumbs = getBreadcrumbs();
    const canGoBack = currentScale !== SCALES.UNIVERSE;

    // Get current scale label
    const getScaleLabel = () => {
        switch (currentScale) {
            case SCALES.UNIVERSE: return '1 unit ≈ 1 million light years';
            case SCALES.GALAXY: return '1 unit ≈ 1,000 light years';
            case SCALES.SOLAR_SYSTEM: return '1 unit ≈ 1 AU';
            case SCALES.PLANET: return '1 unit ≈ 1,000 km';
            default: return '';
        }
    };

    return (
        <div className="scale-indicator glass-panel" style={{
            position: 'absolute',
            top: 'var(--spacing-lg)',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            zIndex: 100
        }}>
            {/* Back button */}
            {canGoBack && (
                <button
                    onClick={navigateBack}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text-primary)',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem'
                    }}
                >
                    ← Back
                </button>
            )}

            {/* Breadcrumbs */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem'
            }}>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.scale}>
                        {index > 0 && (
                            <span style={{ color: 'var(--color-text-muted)' }}>›</span>
                        )}
                        <button
                            onClick={() => navigateTo(crumb.scale)}
                            disabled={crumb.scale === currentScale}
                            style={{
                                background: crumb.scale === currentScale
                                    ? 'var(--gradient-primary)'
                                    : 'transparent',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-text-primary)',
                                padding: '4px 8px',
                                cursor: crumb.scale === currentScale ? 'default' : 'pointer',
                                opacity: crumb.scale === currentScale ? 1 : 0.7,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.8rem'
                            }}
                        >
                            <span>{crumb.icon}</span>
                            <span>{crumb.label}</span>
                        </button>
                    </React.Fragment>
                ))}
            </div>

            {/* Scale label */}
            <div style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-muted)',
                borderLeft: '1px solid var(--color-border)',
                paddingLeft: 'var(--spacing-sm)',
                marginLeft: 'var(--spacing-sm)'
            }}>
                {getScaleLabel()}
            </div>
        </div>
    );
};

export default ScaleIndicator;
