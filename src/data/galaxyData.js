// Galaxy catalog data for the local universe
// Distances are in millions of light years, scaled for visualization

export const SCALE_FACTORS = {
    UNIVERSE: 1,      // 1 unit = 1 million light years
    GALAXY: 0.001,    // 1 unit = 1000 light years  
    SOLAR_SYSTEM: 0.5 // From celestialData.js
};

// Galaxy types
export const GALAXY_TYPES = {
    SPIRAL: 'spiral',
    ELLIPTICAL: 'elliptical',
    IRREGULAR: 'irregular',
    BARRED_SPIRAL: 'barred-spiral'
};

// Our local group of galaxies + nearby galaxies
export const GALAXIES = [
    {
        id: 'milky-way',
        name: 'Milky Way',
        type: GALAXY_TYPES.BARRED_SPIRAL,
        icon: '🌀',
        position: [0, 0, 0],
        size: 0.15, // Increased size for visibility
        rotation: [0, 0, 0],
        color: '#ffeedd',
        armColor: '#7eb8da',
        coreColor: '#fff8e0',
        isHome: true,
        starCount: 8000,
        facts: {
            diameter: '100,000 light years',
            stars: '200-400 billion',
            age: '13.6 billion years',
            type: 'Barred Spiral (SBbc)',
            blackHole: 'Sagittarius A* (4 million M☉)'
        }
    },
    {
        id: 'andromeda',
        name: 'Andromeda Galaxy (M31)',
        type: GALAXY_TYPES.SPIRAL,
        icon: '🌌',
        position: [3, 0.4, -1],
        size: 0.25, // Larger than Milky Way
        rotation: [0.4, 0.3, 0.1],
        color: '#e8d8c8',
        armColor: '#8fc4e8',
        coreColor: '#fff0d0',
        starCount: 10000,
        facts: {
            diameter: '220,000 light years',
            stars: '1 trillion',
            distance: '2.5 million light years',
            type: 'Spiral (SA(s)b)',
            blackHole: '100 million M☉'
        }
    },
    {
        id: 'triangulum',
        name: 'Triangulum Galaxy (M33)',
        type: GALAXY_TYPES.SPIRAL,
        icon: '🔺',
        position: [3.2, -0.3, 1.2],
        size: 0.08,
        rotation: [0.1, 0.6, 0],
        color: '#d0e0f0',
        armColor: '#90c8f0',
        coreColor: '#ffe8b8',
        starCount: 4000,
        facts: {
            diameter: '60,000 light years',
            stars: '40 billion',
            distance: '2.7 million light years',
            type: 'Spiral (SA(s)cd)',
            blackHole: 'None detected'
        }
    },
    {
        id: 'lmc',
        name: 'Large Magellanic Cloud',
        type: GALAXY_TYPES.IRREGULAR,
        icon: '☁️',
        position: [0.2, -0.15, 0.08],
        size: 0.025,
        rotation: [0, 0, 0],
        color: '#c8d8e8',
        armColor: '#a0c0e0',
        coreColor: '#ffd8a0',
        starCount: 2000,
        facts: {
            diameter: '14,000 light years',
            stars: '30 billion',
            distance: '160,000 light years',
            type: 'Irregular (SB(s)m)',
            blackHole: 'Unknown'
        }
    },
    {
        id: 'smc',
        name: 'Small Magellanic Cloud',
        type: GALAXY_TYPES.IRREGULAR,
        icon: '💨',
        position: [0.25, -0.2, -0.05],
        size: 0.015,
        rotation: [0, 0, 0],
        color: '#b0c8d8',
        armColor: '#90b0d0',
        coreColor: '#ffc880',
        starCount: 1500,
        facts: {
            diameter: '7,000 light years',
            stars: '3 billion',
            distance: '200,000 light years',
            type: 'Irregular (SB(s)m pec)',
            blackHole: 'Unknown'
        }
    },
    // Additional galaxies for a richer universe
    {
        id: 'sombrero',
        name: 'Sombrero Galaxy (M104)',
        type: GALAXY_TYPES.SPIRAL,
        icon: '🎩',
        position: [-4, 0.5, 2],
        size: 0.12,
        rotation: [1.4, 0, 0], // Edge-on view
        color: '#f0e0c0',
        armColor: '#d0b080',
        coreColor: '#ffffe0',
        starCount: 5000,
        facts: {
            diameter: '50,000 light years',
            stars: '100 billion',
            distance: '29 million light years',
            type: 'Spiral (SA(s)a)',
            blackHole: '1 billion M☉'
        }
    },
    {
        id: 'whirlpool',
        name: 'Whirlpool Galaxy (M51)',
        type: GALAXY_TYPES.SPIRAL,
        icon: '🌊',
        position: [2, 1.5, 3],
        size: 0.1,
        rotation: [0, 0, 0],
        color: '#e0d0e8',
        armColor: '#b0a0d0',
        coreColor: '#fff0f0',
        starCount: 6000,
        facts: {
            diameter: '76,000 light years',
            stars: '100 billion',
            distance: '23 million light years',
            type: 'Spiral (SA(s)bc pec)',
            blackHole: '1 million M☉'
        }
    },
    {
        id: 'pinwheel',
        name: 'Pinwheel Galaxy (M101)',
        type: GALAXY_TYPES.SPIRAL,
        icon: '🎡',
        position: [-2, -0.8, -3],
        size: 0.18,
        rotation: [0.2, 0, 0.1],
        color: '#d8e8f8',
        armColor: '#88b8e8',
        coreColor: '#fff8e8',
        starCount: 7000,
        facts: {
            diameter: '170,000 light years',
            stars: '1 trillion',
            distance: '21 million light years',
            type: 'Spiral (SAB(rs)cd)',
            blackHole: 'Unknown'
        }
    },
    {
        id: 'cigar',
        name: 'Cigar Galaxy (M82)',
        type: GALAXY_TYPES.IRREGULAR,
        icon: '💨',
        position: [-3, 0.2, -1.5],
        size: 0.06,
        rotation: [0.8, 0, 0],
        color: '#f8d0a0',
        armColor: '#ff8060',
        coreColor: '#ffff80',
        starCount: 3000,
        facts: {
            diameter: '37,000 light years',
            stars: '30 billion',
            distance: '12 million light years',
            type: 'Irregular (I0)',
            blackHole: 'Unknown (starburst galaxy)'
        }
    },
    {
        id: 'centaurus-a',
        name: 'Centaurus A (NGC 5128)',
        type: GALAXY_TYPES.ELLIPTICAL,
        icon: '⚫',
        position: [1.5, -1.2, -2.5],
        size: 0.13,
        rotation: [0.3, 0.5, 0],
        color: '#e0c8a0',
        armColor: '#c0a080',
        coreColor: '#fff8c0',
        starCount: 4000,
        facts: {
            diameter: '60,000 light years',
            stars: '100 billion',
            distance: '13 million light years',
            type: 'Elliptical/Lenticular',
            blackHole: '55 million M☉'
        }
    },
    {
        id: 'cartwheel',
        name: 'Cartwheel Galaxy',
        type: GALAXY_TYPES.IRREGULAR,
        icon: '🎯',
        position: [4, -0.5, -2],
        size: 0.14,
        rotation: [0, 0, 0],
        color: '#a0d0f0',
        armColor: '#60a0e0',
        coreColor: '#ffe0a0',
        starCount: 5000,
        facts: {
            diameter: '150,000 light years',
            stars: 'Unknown',
            distance: '500 million light years',
            type: 'Ring galaxy',
            blackHole: 'Unknown'
        }
    },
    {
        id: 'black-eye',
        name: 'Black Eye Galaxy (M64)',
        type: GALAXY_TYPES.SPIRAL,
        icon: '👁️',
        position: [-1.5, 1, 2.5],
        size: 0.07,
        rotation: [0.5, 0, 0],
        color: '#d0c0b0',
        armColor: '#806040',
        coreColor: '#fff0d0',
        starCount: 3500,
        facts: {
            diameter: '70,000 light years',
            stars: '100 billion',
            distance: '17 million light years',
            type: 'Spiral (SA(rs)ab)',
            blackHole: 'Unknown'
        }
    }
];

// Background galaxies (distant, just points of light)
export const generateBackgroundGalaxies = (count = 800) => {
    const galaxies = [];
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 8 + Math.random() * 50;

        // Varied colors for background galaxies
        const hue = 180 + Math.random() * 60; // Blue to purple range
        const sat = 20 + Math.random() * 40;
        const light = 50 + Math.random() * 40;

        galaxies.push({
            id: `bg-galaxy-${i}`,
            position: [
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            ],
            size: 0.02 + Math.random() * 0.08,
            color: `hsl(${hue}, ${sat}%, ${light}%)`
        });
    }
    return galaxies;
};

// Get galaxy by ID
export const getGalaxyById = (id) => {
    return GALAXIES.find(g => g.id === id);
};

// Search galaxies
export const searchGalaxies = (query) => {
    if (!query || query.trim() === '') return [];
    const normalizedQuery = query.toLowerCase().trim();
    return GALAXIES.filter(g =>
        g.name.toLowerCase().includes(normalizedQuery)
    );
};
