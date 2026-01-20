import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../stores/useStore';
import { PLANETS } from '../data/celestialData';
import Sun from './Sun';
import Planet from './Planet';
import Moon from './Moon';
import AsteroidBelt from './AsteroidBelt';

const SolarSystem = () => {
    const earthRef = useRef();
    const planetRefs = useRef({});

    const { timeScale, isPaused } = useStore();

    // Store Earth ref for Moon to follow
    const earthMeshRef = useRef();

    // Generate random initial angles for planets
    const initialAngles = useMemo(() => {
        return PLANETS.reduce((acc, planet) => {
            acc[planet.id] = Math.random() * Math.PI * 2;
            return acc;
        }, {});
    }, []);

    return (
        <group>
            {/* The Sun at center */}
            <Sun />

            {/* All planets */}
            {PLANETS.map((planet) => (
                <PlanetWithRef
                    key={planet.id}
                    data={planet}
                    initialAngle={initialAngles[planet.id]}
                    ref={planet.id === 'earth' ? earthMeshRef : undefined}
                    isEarth={planet.id === 'earth'}
                />
            ))}

            {/* Moon orbiting Earth */}
            <Moon earthRef={earthMeshRef} />

            {/* Asteroid Belt */}
            <AsteroidBelt count={4000} />
        </group>
    );
};

// Separate component to handle ref forwarding for Earth
const PlanetWithRef = React.forwardRef(({ data, initialAngle, isEarth }, ref) => {
    const meshRef = useRef();
    const orbitRef = useRef();
    const ringRef = useRef();

    const { timeScale, isPaused, setSelectedObject, showOrbits } = useStore();

    // Calculate orbital speed from period
    const orbitalSpeed = useMemo(() => {
        return (2 * Math.PI) / (data.orbitalPeriod * 60);
    }, [data.orbitalPeriod]);

    // Create orbit line geometry
    const orbitGeometry = useMemo(() => {
        const points = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(
                new THREE.Vector3(
                    Math.cos(angle) * data.orbitalRadius,
                    0,
                    Math.sin(angle) * data.orbitalRadius
                )
            );
        }
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [data.orbitalRadius]);

    // Saturn's rings geometry
    const ringGeometry = useMemo(() => {
        if (!data.hasRings) return null;
        return new THREE.RingGeometry(data.ringInnerRadius, data.ringOuterRadius, 64);
    }, [data.hasRings, data.ringInnerRadius, data.ringOuterRadius]);

    // Animation
    useFrame((state, delta) => {
        if (meshRef.current && !isPaused) {
            const time = state.clock.getElapsedTime();
            const angle = initialAngle + time * orbitalSpeed * timeScale;

            meshRef.current.position.x = Math.cos(angle) * data.orbitalRadius;
            meshRef.current.position.z = Math.sin(angle) * data.orbitalRadius;
            meshRef.current.position.y = 0;

            // Self rotation
            meshRef.current.rotation.y += delta * (1 / Math.abs(data.rotationPeriod || 1)) * 0.5;

            // Update rings position if present
            if (ringRef.current) {
                ringRef.current.position.copy(meshRef.current.position);
            }

            // Forward ref for Earth
            if (isEarth && ref) {
                ref.current = meshRef.current;
            }
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedObject({
            ...data,
            currentPosition: meshRef.current ? meshRef.current.position.toArray() : [0, 0, 0]
        });
    };

    return (
        <group>
            {/* Orbit path */}
            {showOrbits && (
                <line ref={orbitRef} geometry={orbitGeometry}>
                    <lineBasicMaterial
                        color={data.color}
                        transparent
                        opacity={0.15}
                    />
                </line>
            )}

            {/* Planet sphere */}
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    document.body.style.cursor = 'default';
                }}
            >
                <sphereGeometry args={[Math.max(data.radius, 0.3), 32, 32]} />
                <meshStandardMaterial
                    color={data.color}
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>

            {/* Saturn's rings */}
            {data.hasRings && ringGeometry && (
                <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
                    <primitive object={ringGeometry} attach="geometry" />
                    <meshStandardMaterial
                        color="#f4d59e"
                        transparent
                        opacity={0.5}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
        </group>
    );
});

PlanetWithRef.displayName = 'PlanetWithRef';

export default SolarSystem;
