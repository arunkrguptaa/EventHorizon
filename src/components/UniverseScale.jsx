import React, { useMemo } from 'react';
import useStore, { SCALES } from '../stores/useStore';
import Galaxy from './Galaxy';
import { GALAXIES, generateBackgroundGalaxies } from '../data/galaxyData';

// Background galaxy particles for distant universe
const BackgroundGalaxies = () => {
    const bgGalaxies = useMemo(() => generateBackgroundGalaxies(300), []);

    const positions = useMemo(() => {
        const pos = new Float32Array(bgGalaxies.length * 3);
        bgGalaxies.forEach((g, i) => {
            pos[i * 3] = g.position[0];
            pos[i * 3 + 1] = g.position[1];
            pos[i * 3 + 2] = g.position[2];
        });
        return pos;
    }, [bgGalaxies]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={bgGalaxies.length}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#8899bb"
                size={0.3}
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    );
};

const UniverseScale = () => {
    const { navigateTo, setSelectedObject } = useStore();

    const handleGalaxyClick = (galaxy) => {
        setSelectedObject({
            ...galaxy,
            currentPosition: galaxy.position
        });
    };

    const handleGalaxyDoubleClick = (galaxy) => {
        // Zoom into the galaxy
        navigateTo(SCALES.GALAXY, galaxy.id);
    };

    return (
        <group>
            {/* Main galaxies */}
            {GALAXIES.map((galaxy) => (
                <group
                    key={galaxy.id}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleGalaxyDoubleClick(galaxy);
                    }}
                >
                    <Galaxy
                        data={galaxy}
                        onClick={() => handleGalaxyClick(galaxy)}
                    />
                </group>
            ))}

            {/* Distant background galaxies */}
            <BackgroundGalaxies />

            {/* Ambient cosmic glow */}
            <mesh>
                <sphereGeometry args={[150, 32, 32]} />
                <meshBasicMaterial
                    color="#1a1a2e"
                    transparent
                    opacity={0.3}
                    side={2} // BackSide
                />
            </mesh>
        </group>
    );
};

export default UniverseScale;
