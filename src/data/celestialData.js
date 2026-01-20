// Celestial object data for the solar system
// Distances and sizes are scaled for visualization

// Scale factors
export const DISTANCE_SCALE = 0.5; // Scale down orbital distances
export const SIZE_SCALE = 0.01;    // Scale down planet sizes
export const SUN_SCALE = 0.001;    // Sun needs extra scaling (it's huge!)

// Planet data with real astronomical values (scaled for visualization)
export const PLANETS = [
    {
        id: 'mercury',
        name: 'Mercury',
        type: 'planet',
        icon: '☿',
        color: '#b5b5b5',
        radius: 2439.7 * SIZE_SCALE,         // km -> scaled
        orbitalRadius: 57.9 * DISTANCE_SCALE, // million km -> scaled
        orbitalPeriod: 88,                     // days
        rotationPeriod: 58.6,                  // days
        axialTilt: 0.034,                      // degrees
        texture: null,
        facts: {
            diameter: '4,879 km',
            distance: '57.9 million km',
            dayLength: '58.6 Earth days',
            yearLength: '88 Earth days',
            moons: 0
        }
    },
    {
        id: 'venus',
        name: 'Venus',
        type: 'planet',
        icon: '♀',
        color: '#e6c35c',
        radius: 6051.8 * SIZE_SCALE,
        orbitalRadius: 108.2 * DISTANCE_SCALE,
        orbitalPeriod: 225,
        rotationPeriod: -243, // Negative = retrograde rotation
        axialTilt: 177.4,
        texture: null,
        facts: {
            diameter: '12,104 km',
            distance: '108.2 million km',
            dayLength: '243 Earth days',
            yearLength: '225 Earth days',
            moons: 0
        }
    },
    {
        id: 'earth',
        name: 'Earth',
        type: 'planet',
        icon: '🌍',
        color: '#6b93d6',
        radius: 6371 * SIZE_SCALE,
        orbitalRadius: 149.6 * DISTANCE_SCALE,
        orbitalPeriod: 365.25,
        rotationPeriod: 1,
        axialTilt: 23.4,
        texture: null,
        facts: {
            diameter: '12,742 km',
            distance: '149.6 million km',
            dayLength: '24 hours',
            yearLength: '365.25 days',
            moons: 1
        }
    },
    {
        id: 'mars',
        name: 'Mars',
        type: 'planet',
        icon: '♂',
        color: '#c1440e',
        radius: 3389.5 * SIZE_SCALE,
        orbitalRadius: 227.9 * DISTANCE_SCALE,
        orbitalPeriod: 687,
        rotationPeriod: 1.03,
        axialTilt: 25.2,
        texture: null,
        facts: {
            diameter: '6,779 km',
            distance: '227.9 million km',
            dayLength: '24.6 hours',
            yearLength: '687 Earth days',
            moons: 2
        }
    },
    {
        id: 'jupiter',
        name: 'Jupiter',
        type: 'planet',
        icon: '♃',
        color: '#d8ca9d',
        radius: 69911 * SIZE_SCALE * 0.3, // Extra scale down for gas giants
        orbitalRadius: 778.5 * DISTANCE_SCALE * 0.5,
        orbitalPeriod: 4333,
        rotationPeriod: 0.41,
        axialTilt: 3.1,
        texture: null,
        facts: {
            diameter: '139,820 km',
            distance: '778.5 million km',
            dayLength: '9.9 hours',
            yearLength: '11.9 Earth years',
            moons: 95
        }
    },
    {
        id: 'saturn',
        name: 'Saturn',
        type: 'planet',
        icon: '♄',
        color: '#f4d59e',
        radius: 58232 * SIZE_SCALE * 0.3,
        orbitalRadius: 1432 * DISTANCE_SCALE * 0.4,
        orbitalPeriod: 10759,
        rotationPeriod: 0.45,
        axialTilt: 26.7,
        hasRings: true,
        ringInnerRadius: 66900 * SIZE_SCALE * 0.3,
        ringOuterRadius: 140220 * SIZE_SCALE * 0.3,
        texture: null,
        facts: {
            diameter: '116,460 km',
            distance: '1.4 billion km',
            dayLength: '10.7 hours',
            yearLength: '29.4 Earth years',
            moons: 146
        }
    },
    {
        id: 'uranus',
        name: 'Uranus',
        type: 'planet',
        icon: '⛢',
        color: '#b5e3e3',
        radius: 25362 * SIZE_SCALE * 0.3,
        orbitalRadius: 2867 * DISTANCE_SCALE * 0.3,
        orbitalPeriod: 30687,
        rotationPeriod: -0.72,
        axialTilt: 97.8,
        texture: null,
        facts: {
            diameter: '50,724 km',
            distance: '2.9 billion km',
            dayLength: '17.2 hours',
            yearLength: '84 Earth years',
            moons: 28
        }
    },
    {
        id: 'neptune',
        name: 'Neptune',
        type: 'planet',
        icon: '♆',
        color: '#5b5ddf',
        radius: 24622 * SIZE_SCALE * 0.3,
        orbitalRadius: 4515 * DISTANCE_SCALE * 0.25,
        orbitalPeriod: 60190,
        rotationPeriod: 0.67,
        axialTilt: 28.3,
        texture: null,
        facts: {
            diameter: '49,244 km',
            distance: '4.5 billion km',
            dayLength: '16.1 hours',
            yearLength: '164.8 Earth years',
            moons: 16
        }
    }
];

// Sun data
export const SUN = {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    icon: '☀️',
    color: '#fff5e6',
    emissiveColor: '#ffa726',
    radius: 696340 * SUN_SCALE,
    facts: {
        diameter: '1.39 million km',
        distance: '0 km (center)',
        surfaceTemp: '5,500°C',
        coreTemp: '15 million°C',
        age: '4.6 billion years'
    }
};

// Moon data
export const MOON = {
    id: 'moon',
    name: 'Moon',
    type: 'moon',
    icon: '🌙',
    color: '#c4c4c4',
    radius: 1737.4 * SIZE_SCALE * 2, // Slightly larger for visibility
    orbitalRadius: 0.384 * 3, // Scaled up for visibility around Earth
    orbitalPeriod: 27.3,
    parentId: 'earth',
    facts: {
        diameter: '3,474 km',
        distance: '384,400 km from Earth',
        dayLength: '27.3 Earth days',
        yearLength: '27.3 Earth days',
        gravity: '1.62 m/s²'
    }
};

// All celestial objects combined for search
export const ALL_CELESTIAL_OBJECTS = [
    SUN,
    ...PLANETS,
    MOON
];

// Get object by ID
export const getCelestialObjectById = (id) => {
    return ALL_CELESTIAL_OBJECTS.find(obj => obj.id === id);
};

// Search objects by name
export const searchCelestialObjects = (query) => {
    if (!query || query.trim() === '') return [];

    const normalizedQuery = query.toLowerCase().trim();

    return ALL_CELESTIAL_OBJECTS.filter(obj =>
        obj.name.toLowerCase().includes(normalizedQuery) ||
        obj.type.toLowerCase().includes(normalizedQuery)
    ).slice(0, 10); // Limit to 10 results
};
