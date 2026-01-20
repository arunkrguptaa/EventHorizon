import React, { useState, useEffect, useCallback } from 'react';
import useStore, { SCALES } from '../stores/useStore';
import { searchCelestialObjects } from '../data/celestialData';
import { searchStars } from '../data/starCatalog';
import { searchGalaxies } from '../data/galaxyData';

const SearchPanel = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const { setSelectedObject, setCameraTarget, currentScale, navigateTo } = useStore();

    // Debounced search
    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(() => {
            let combined = [];

            // Always search galaxies
            const galaxyResults = searchGalaxies(query).map(g => ({
                ...g,
                resultType: 'galaxy'
            }));
            combined = [...combined, ...galaxyResults];

            // Search planets (relevant when at solar system scale)
            const celestialResults = searchCelestialObjects(query).map(c => ({
                ...c,
                resultType: 'celestial'
            }));
            combined = [...combined, ...celestialResults];

            // Search named stars
            const starResults = searchStars(query).map(star => ({
                ...star,
                type: 'star',
                icon: '⭐',
                resultType: 'star'
            }));
            combined = [...combined, ...starResults];

            // Add special searches
            if ('black hole'.includes(query.toLowerCase()) || 'sagittarius'.includes(query.toLowerCase())) {
                combined.unshift({
                    id: 'sagittarius-a',
                    name: 'Sagittarius A*',
                    type: 'black hole',
                    icon: '🕳️',
                    resultType: 'blackhole'
                });
            }

            setResults(combined.slice(0, 10));
            setIsOpen(combined.length > 0);
        }, 150);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = useCallback((item) => {
        setSelectedObject(item);

        // Navigate to appropriate scale based on result type
        if (item.resultType === 'galaxy') {
            if (currentScale === SCALES.UNIVERSE) {
                setCameraTarget(item.position);
            } else {
                navigateTo(SCALES.UNIVERSE);
                setTimeout(() => setCameraTarget(item.position), 100);
            }
        } else if (item.resultType === 'blackhole') {
            if (currentScale !== SCALES.GALAXY) {
                navigateTo(SCALES.GALAXY, 'milky-way');
            }
            setTimeout(() => setCameraTarget([0, 0, 0]), 100);
        } else if (item.resultType === 'celestial') {
            if (currentScale !== SCALES.SOLAR_SYSTEM) {
                navigateTo(SCALES.SOLAR_SYSTEM);
            }
            if (item.currentPosition) {
                setTimeout(() => setCameraTarget(item.currentPosition), 100);
            }
        }

        setQuery('');
        setResults([]);
        setIsOpen(false);
    }, [setSelectedObject, setCameraTarget, currentScale, navigateTo]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setQuery('');
            setResults([]);
            setIsOpen(false);
        }
    };

    return (
        <div className="search-panel glass-panel">
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search galaxies, planets, black holes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                />
            </div>

            {isOpen && results.length > 0 && (
                <div className="search-results">
                    {results.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="search-result-item"
                            onClick={() => handleSelect(item)}
                        >
                            <span className="icon">{item.icon || '🌟'}</span>
                            <span className="name">{item.name}</span>
                            <span className="type">{item.type}</span>
                        </div>
                    ))}
                </div>
            )}

            {query.trim() !== '' && results.length === 0 && (
                <div className="search-results">
                    <div className="search-result-item" style={{ opacity: 0.5, cursor: 'default' }}>
                        <span className="name">No results found</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPanel;
