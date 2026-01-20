import { create } from 'zustand';

// Scale levels for navigation
export const SCALES = {
    UNIVERSE: 'universe',
    GALAXY: 'galaxy',
    SOLAR_SYSTEM: 'solar-system',
    PLANET: 'planet'
};

// Zustand store for application state
const useStore = create((set, get) => ({
    // ===== SCALE & NAVIGATION =====
    currentScale: SCALES.UNIVERSE, // Start at universe level
    setCurrentScale: (scale) => set({ currentScale: scale }),

    // Current location in the hierarchy
    currentLocation: {
        galaxyId: null,
        solarSystemId: null,
        planetId: null
    },
    setCurrentLocation: (location) => set({
        currentLocation: { ...get().currentLocation, ...location }
    }),

    // Navigate to a specific scale with target
    navigateTo: (scale, targetId = null) => {
        const current = get().currentLocation;

        switch (scale) {
            case SCALES.UNIVERSE:
                set({
                    currentScale: scale,
                    currentLocation: { galaxyId: null, solarSystemId: null, planetId: null }
                });
                break;
            case SCALES.GALAXY:
                set({
                    currentScale: scale,
                    currentLocation: { ...current, galaxyId: targetId, solarSystemId: null, planetId: null }
                });
                break;
            case SCALES.SOLAR_SYSTEM:
                set({
                    currentScale: scale,
                    currentLocation: { ...current, solarSystemId: targetId, planetId: null }
                });
                break;
            case SCALES.PLANET:
                set({
                    currentScale: scale,
                    currentLocation: { ...current, planetId: targetId }
                });
                break;
        }
    },

    // Go back one level
    navigateBack: () => {
        const { currentScale } = get();
        switch (currentScale) {
            case SCALES.PLANET:
                get().navigateTo(SCALES.SOLAR_SYSTEM);
                break;
            case SCALES.SOLAR_SYSTEM:
                get().navigateTo(SCALES.GALAXY);
                break;
            case SCALES.GALAXY:
                get().navigateTo(SCALES.UNIVERSE);
                break;
        }
    },

    // Transition animation state
    isTransitioning: false,
    setIsTransitioning: (value) => set({ isTransitioning: value }),

    // ===== SELECTED OBJECT =====
    selectedObject: null,
    setSelectedObject: (object) => set({ selectedObject: object }),
    clearSelectedObject: () => set({ selectedObject: null }),

    // ===== CAMERA =====
    cameraTarget: null,
    setCameraTarget: (target) => set({ cameraTarget: target }),
    clearCameraTarget: () => set({ cameraTarget: null }),

    // ===== SEARCH =====
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    searchResults: [],
    setSearchResults: (results) => set({ searchResults: results }),

    // ===== UI TOGGLES =====
    showLabels: true,
    toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),

    showOrbits: true,
    toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),

    showPerformanceMonitor: false,
    togglePerformanceMonitor: () => set((state) => ({ showPerformanceMonitor: !state.showPerformanceMonitor })),

    // ===== PERFORMANCE =====
    fps: 60,
    setFps: (fps) => set({ fps }),
    objectCount: 0,
    setObjectCount: (count) => set({ objectCount: count }),

    // ===== TIME & ANIMATION =====
    timeScale: 1000,
    setTimeScale: (scale) => set({ timeScale: scale }),

    isPaused: false,
    togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

    // ===== AUDIO =====
    audioEnabled: false,
    toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
}));

export default useStore;
