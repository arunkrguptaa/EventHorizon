// Star catalog with procedurally generated star data
// This simulates real astronomical data with proper distributions

// Convert spectral type to color
const SPECTRAL_COLORS = {
    O: '#9bb0ff', // Blue
    B: '#aabfff', // Blue-white
    A: '#cad7ff', // White
    F: '#f8f7ff', // Yellow-white
    G: '#fff4ea', // Yellow (like our Sun)
    K: '#ffd2a1', // Orange
    M: '#ffcc6f', // Red
};

// Generate random star positions in a spherical distribution
const generateStars = (count = 10000) => {
    const stars = [];

    for (let i = 0; i < count; i++) {
        // Use spherical coordinates for even distribution
        const theta = Math.random() * Math.PI * 2; // Azimuth angle
        const phi = Math.acos(2 * Math.random() - 1); // Polar angle
        const radius = 200 + Math.random() * 800; // Distance from center

        // Convert to Cartesian coordinates
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        // Assign spectral type based on realistic distribution
        // M stars are most common, O stars are rare
        const typeRoll = Math.random();
        let spectralType;
        if (typeRoll < 0.0001) spectralType = 'O';
        else if (typeRoll < 0.001) spectralType = 'B';
        else if (typeRoll < 0.006) spectralType = 'A';
        else if (typeRoll < 0.03) spectralType = 'F';
        else if (typeRoll < 0.1) spectralType = 'G';
        else if (typeRoll < 0.2) spectralType = 'K';
        else spectralType = 'M';

        // Generate magnitude (brightness)
        // Brighter stars are rarer
        const magnitude = 4 + Math.random() * 6; // Range 4-10 (dimmer)

        stars.push({
            id: `star-${i}`,
            position: [x, y, z],
            color: SPECTRAL_COLORS[spectralType],
            spectralType,
            magnitude,
            size: Math.max(0.5, (10 - magnitude) / 3), // Bigger for brighter stars
        });
    }

    // Add some notable bright stars
    const brightStars = [
        { name: 'Sirius', position: [150, 20, -100], spectralType: 'A', magnitude: -1.46 },
        { name: 'Canopus', position: [-120, -80, 200], spectralType: 'F', magnitude: -0.74 },
        { name: 'Arcturus', position: [80, 150, -50], spectralType: 'K', magnitude: -0.05 },
        { name: 'Vega', position: [30, 100, 120], spectralType: 'A', magnitude: 0.03 },
        { name: 'Capella', position: [-60, 120, -80], spectralType: 'G', magnitude: 0.08 },
        { name: 'Rigel', position: [200, -30, 150], spectralType: 'B', magnitude: 0.13 },
        { name: 'Betelgeuse', position: [180, 40, -120], spectralType: 'M', magnitude: 0.42 },
        { name: 'Aldebaran', position: [-150, 60, 100], spectralType: 'K', magnitude: 0.85 },
        { name: 'Antares', position: [100, -120, -180], spectralType: 'M', magnitude: 0.96 },
        { name: 'Polaris', position: [0, 250, 0], spectralType: 'F', magnitude: 1.98 },
    ];

    brightStars.forEach((star, i) => {
        stars.push({
            id: `bright-star-${i}`,
            name: star.name,
            position: star.position,
            color: SPECTRAL_COLORS[star.spectralType],
            spectralType: star.spectralType,
            magnitude: star.magnitude,
            size: Math.max(2, (10 - star.magnitude) / 2),
            isNamed: true,
        });
    });

    return stars;
};

// Cached star data
let starCache = null;

export const getStarCatalog = (count = 10000) => {
    if (!starCache || starCache.length !== count + 10) {
        starCache = generateStars(count);
    }
    return starCache;
};

// Get positions as Float32Array for buffer geometry
export const getStarPositions = (stars) => {
    const positions = new Float32Array(stars.length * 3);
    stars.forEach((star, i) => {
        positions[i * 3] = star.position[0];
        positions[i * 3 + 1] = star.position[1];
        positions[i * 3 + 2] = star.position[2];
    });
    return positions;
};

// Get colors as Float32Array for buffer geometry
export const getStarColors = (stars) => {
    const colors = new Float32Array(stars.length * 3);
    stars.forEach((star, i) => {
        // Parse hex color to RGB
        const hex = star.color.replace('#', '');
        colors[i * 3] = parseInt(hex.substr(0, 2), 16) / 255;
        colors[i * 3 + 1] = parseInt(hex.substr(2, 2), 16) / 255;
        colors[i * 3 + 2] = parseInt(hex.substr(4, 2), 16) / 255;
    });
    return colors;
};

// Get sizes as Float32Array for buffer geometry
export const getStarSizes = (stars) => {
    const sizes = new Float32Array(stars.length);
    stars.forEach((star, i) => {
        sizes[i] = star.size;
    });
    return sizes;
};

// Search stars by name
export const searchStars = (query) => {
    if (!starCache) getStarCatalog();
    if (!query || query.trim() === '') return [];

    const normalizedQuery = query.toLowerCase().trim();
    return starCache
        .filter(star => star.name && star.name.toLowerCase().includes(normalizedQuery))
        .slice(0, 10);
};

export default {
    getStarCatalog,
    getStarPositions,
    getStarColors,
    getStarSizes,
    searchStars,
};
