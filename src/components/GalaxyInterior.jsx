import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../stores/useStore';
import BlackHole from './BlackHole';

// Generate star clusters for galaxy interior
const generateStarClusters = (count = 50) => {
    const clusters = [];
    for (let i = 0; i < count; i++) {
        // Spiral arm distribution
        const arm = Math.floor(Math.random() * 2);
        const angle = Math.random() * Math.PI * 3 + arm * Math.PI;
        const radius = 10 + Math.random() * 80;
        const spiralFactor = 0.15;

        const x = Math.cos(angle + radius * spiralFactor) * radius;
        const z = Math.sin(angle + radius * spiralFactor) * radius;
        const y = (Math.random() - 0.5) * 10;

        clusters.push({
            id: `cluster-${i}`,
            position: [x, y, z],
            size: 1 + Math.random() * 3,
            starCount: 50 + Math.floor(Math.random() * 150),
            color: `hsl(${200 + Math.random() * 60}, ${40 + Math.random() * 30}%, ${70 + Math.random() * 20}%)`
        });
    }
    return clusters;
};

// Generate nebulae
const generateNebulae = (count = 15) => {
    const nebulae = [];
    const colors = ['#ff6b9d', '#c86bff', '#6bc5ff', '#ff9f6b', '#6bff9f'];

    for (let i = 0; i < count; i++) {
        const arm = Math.floor(Math.random() * 2);
        const angle = Math.random() * Math.PI * 3 + arm * Math.PI;
        const radius = 20 + Math.random() * 60;

        nebulae.push({
            id: `nebula-${i}`,
            position: [
                Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 8,
                Math.sin(angle) * radius + (Math.random() - 0.5) * 10
            ],
            size: 5 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 0.1 + Math.random() * 0.2
        });
    }
    return nebulae;
};

// Star cluster component
const StarCluster = ({ data }) => {
    const { position, size, starCount, color } = data;
    const { setCurrentScale, setCameraTarget, setSelectedObject } = useStore();

    const positions = useMemo(() => {
        const pos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = Math.pow(Math.random(), 0.5) * size;

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, [starCount, size]);

    const handleClick = (e) => {
        e.stopPropagation();
        // Clicking a star cluster zooms into a solar system
        setCurrentScale('solar-system');
        setCameraTarget([100, 50, 100]);
    };

    return (
        <group position={position}>
            <points
                onClick={handleClick}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { document.body.style.cursor = 'default'; }}
            >
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={starCount}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color={color}
                    size={0.3}
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                />
            </points>
        </group>
    );
};

// Nebula component
const Nebula = ({ data }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            meshRef.current.rotation.z = time * 0.02;
            meshRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.1);
        }
    });

    return (
        <mesh ref={meshRef} position={data.position}>
            <sphereGeometry args={[data.size, 16, 16]} />
            <meshBasicMaterial
                color={data.color}
                transparent
                opacity={data.opacity}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

// Solar System Marker (shows where our solar system is)
const SolarSystemMarker = () => {
    const markerRef = useRef();
    const { setCurrentScale, setCameraTarget, setSelectedObject } = useStore();

    // Position in the Orion Arm, about 26,000 ly from center
    const position = [40, 0, 15];

    useFrame((state) => {
        if (markerRef.current) {
            const time = state.clock.getElapsedTime();
            markerRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.2);
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedObject({
            id: 'solar-system',
            name: 'Solar System',
            type: 'solar system',
            icon: '☀️',
            currentPosition: position,
            facts: {
                location: 'Orion Arm',
                distance: '26,000 light years from center',
                planets: '8',
                age: '4.6 billion years',
                star: 'Sun (G-type main sequence)'
            }
        });
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        setCurrentScale('solar-system');
        setCameraTarget([100, 50, 100]);
    };

    return (
        <group position={position}>
            {/* Marker glow */}
            <mesh
                ref={markerRef}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { document.body.style.cursor = 'default'; }}
            >
                <sphereGeometry args={[1.5, 16, 16]} />
                <meshBasicMaterial color="#ffdd44" transparent opacity={0.9} />
            </mesh>

            {/* Outer ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2, 2.5, 32]} />
                <meshBasicMaterial color="#ffdd44" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>

            {/* Label indicator line */}
            <mesh position={[0, 5, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 10, 8]} />
                <meshBasicMaterial color="#ffdd44" transparent opacity={0.3} />
            </mesh>
        </group>
    );
};

const GalaxyInterior = () => {
    const groupRef = useRef();

    // Generate galaxy content
    const starClusters = useMemo(() => generateStarClusters(60), []);
    const nebulae = useMemo(() => generateNebulae(20), []);

    // Background stars
    const bgStars = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Disk distribution
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 100;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        return positions;
    }, []);

    return (
        <group ref={groupRef}>
            {/* Central supermassive black hole */}
            <BlackHole position={[0, 0, 0]} size={3} name="Sagittarius A*" />

            {/* Star clusters in spiral arms */}
            {starClusters.map((cluster) => (
                <StarCluster key={cluster.id} data={cluster} />
            ))}

            {/* Nebulae */}
            {nebulae.map((nebula) => (
                <Nebula key={nebula.id} data={nebula} />
            ))}

            {/* Our Solar System marker */}
            <SolarSystemMarker />

            {/* Background stars */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={bgStars.length / 3}
                        array={bgStars}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color="#ffffff"
                    size={0.2}
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                />
            </points>
        </group>
    );
};

export default GalaxyInterior;
